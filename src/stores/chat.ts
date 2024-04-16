import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import type { UploadFile } from 'antd'
import { fetchChatList, fetchChatSession, fetchDeleteSession } from '~/api'
import type { ChatItemType, ChatSessionItem } from '~/api/chat/types'
import { functionCodeType } from '~/api/chat/types'
import { apiMap } from '~/consts/send-api-config'

interface SessionState {
  page: number
  size: number
  total: number
  hasMore: boolean
  chatCode: string
  list: ChatSessionItem[]
  chatName: string
  functionCode: functionCodeType
}

interface ChatStoreState {
  sessions: {
    [k: string]: SessionState | null
  }
  gptCode: string
  currentSession: SessionState
  isSessionLoading: boolean
  sideList: ChatItemType[]
  isSideListLoading: boolean
}

interface ChatStoreActions {
  handleCheckSession: (i: ChatItemType) => void
  handleLoadHistory: (c?: string) => void
  handleSendSeesion: (c: string, f: UploadFile[]) => void
  handleGetChatList: () => Promise<ChatItemType[]>
  handleDeleteSession: (c: string) => void
}

const initState = {
  sessions: {},
  currentSession: {
    page: 1,
    size: 10,
    total: 0,
    hasMore: true,
    chatCode: '',
    list: [],
    chatName: '',
    functionCode: '' as any,
  },
  gptCode: 'gpt_2',
  isSessionLoading: true, // 聊天框骨架
  sideList: [],
  isSideListLoading: true,
}

export const useChatStore = create<ChatStoreState & ChatStoreActions>()(immer(devtools((set, get) => ({
  ...initState,
  // 切换聊天
  async handleCheckSession(i) {
    const { chatCode } = i

    // 切换时缓存上一个聊天记录
    set((state) => {
      const { currentSession } = get()
      if (chatCode.length) {
        state.sessions[currentSession.chatCode] = currentSession
        state.currentSession = {
          page: 1,
          size: 10,
          total: 0,
          chatCode: '',
          hasMore: true,
          list: [],
          chatName: '',
          functionCode: '' as any,
        }
      }
      state.isSessionLoading = true
    })

    const { sessions, handleLoadHistory } = get()
    const cache = sessions[chatCode]
    // 判断下一个聊天是否有缓存的记录
    if (cache) {
      set({
        currentSession: {
          ...cache,
        },
        isSessionLoading: false,
      })
      return
    }

    await handleLoadHistory(chatCode)
  },
  // 获取历史记录
  async handleLoadHistory(chatCode = get().currentSession.chatCode) {
    const { currentSession: { page, size, hasMore } } = get()

    if (!hasMore)
      return

    const res = await fetchChatSession({
      page,
      size,
      chatCode,
    })

    set((state) => {
      state.currentSession = {
        page: page + 1,
        size: 10,
        hasMore: res.hasMore,
        list: [...res.list, ...state.currentSession.list],
        chatCode,
        chatName: res.chatName,
        total: res.total,
        functionCode: res.functionCode,
      }
      state.isSessionLoading = false
    })
  },
  // 发消息
  async handleSendSeesion(content, fileList) {
    const { currentSession: { chatCode, functionCode }, gptCode } = get()
    const fetchApi = apiMap[gptCode][functionCode]

    let res: any
    if (functionCode === functionCodeType.function3) {
      const formData = new FormData()
      fileList.length && formData.append('image', fileList[0].originFileObj as File)
      formData.append('content', content)
      formData.append('chatCode', chatCode)
      res = await fetchApi(formData)
    }
    else {
      res = await fetchApi({
        content,
        chatCode,
      })
    }

    set((state) => {
      state.currentSession.list.push(res)
    })
  },
  // 获取列表
  async handleGetChatList() {
    set({
      isSideListLoading: true,
    })
    const data = await fetchChatList({
      gptCode: get().gptCode,
    })

    set({
      sideList: data,
      isSideListLoading: false,
    })

    return data
  },
  // 删除会话
  async handleDeleteSession(chatCode) {
    await fetchDeleteSession({
      chatCode,
    })

    set((state) => {
      state.sessions[chatCode] = null
    })
  },
}))))

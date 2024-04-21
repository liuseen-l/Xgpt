import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import type { UploadFile } from 'antd'
import { fetchChatList, fetchChatSession, fetchDeleteSession } from '~/api'
import { FunctionCodeType } from '~/api/chat/types'
import type { ChatItemType, ChatSessionItem } from '~/api/chat/types'

import { GPT_URL, apiMap } from '~/consts/send-api-config'
import { getTimeUnixStr } from '~/utils/common'

interface SessionState {
  page: number
  size: number
  total: number
  hasMore: boolean
  chatCode: string
  list: ChatSessionItem[]
  chatName: string
  functionCode: FunctionCodeType
}

interface ChatStoreState {
  chatCaches: {
    [k: string]: SessionState | null
  }
  gptCode: string
  currentSession: SessionState
  isSessionLoading: boolean
  sideList: ChatItemType[]
  isSideListLoading: boolean
  gptCaches: {
    [k: string]: ChatStoreState['chatCaches']
  }
  isSendLoading: boolean
  cid: string
}

interface ChatStoreActions {
  handleCheckSession: (i: ChatItemType) => void
  handleLoadHistory: (c?: string) => void
  handleSendSeesion: (c: string, f: UploadFile[], isRebuild?: boolean) => any
  handleGetChatList: () => Promise<ChatItemType[]>
  handleDeleteSession: (c: string) => void
  handleInit: (config?: Partial<ChatStoreState>) => void
}

const initState = {
  chatCaches: {},
  gptCaches: {},
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
  gptCode: '',
  isSessionLoading: true, // 聊天框骨架
  sideList: [],
  isSideListLoading: true,
  isSendLoading: false,
  cid: '',
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
        state.chatCaches[currentSession.chatCode] = currentSession
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

    const { chatCaches, handleLoadHistory } = get()
    const cache = chatCaches[chatCode]
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
  async handleSendSeesion(content, fileList, isRebuild = false) {
    const cid = getTimeUnixStr()
    set({
      cid,
      isSendLoading: true,
    })
    const { currentSession: { chatCode, functionCode }, gptCode } = get()
    const fetchApi = apiMap[functionCode]
    const fetchUrl = GPT_URL[gptCode][functionCode]

    let res: any
    // 图片理解
    if (functionCode === FunctionCodeType.function3) {
      const formData = new FormData()
      fileList.length && formData.append('image', fileList[0].originFileObj as File)
      formData.append('content', content)
      formData.append('chatCode', chatCode)
      formData.append('isRebuild', `${isRebuild}`)
      formData.append('cid', cid)
      res = await fetchApi(fetchUrl, formData)
    }
    else {
      res = await fetchApi(fetchUrl, {
        content,
        chatCode,
        cid,
        isRebuild,
      })
    }

    if (res) {
      set((state) => {
        if (isRebuild)
          state.currentSession.list.pop()

        state.currentSession.list.push(res)
      })
    }
    set({
      cid: '',
      isSendLoading: false,
    })
    return res
  },
  // 获取列表
  async handleGetChatList() {
    const { gptCode } = get()

    set({
      isSideListLoading: true,
    })

    const data = await fetchChatList({
      gptCode,
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
      state.chatCaches[chatCode] = null
    })
  },
  handleInit(config = {}) {
    const { gptCode } = config

    // 获取缓存
    if (gptCode?.length) {
      const sessions = get().gptCaches[gptCode] || {}
      config.chatCaches = sessions
    }

    set({
      ...initState,
      ...config,
    })
  },
}))))

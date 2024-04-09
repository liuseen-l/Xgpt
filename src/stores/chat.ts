import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { fetchChatSession } from '~/api'
import type { ChatItemType, ChatSessionItem } from '~/api/chat/types'

interface SessionState {
  page: number
  size: number
  total: number
  hasMore: boolean
  chatCode: string
  list: ChatSessionItem[]
}

interface ChatStoreState {
  sessions: {
    [k: string]: SessionState
  }
  currentSession: SessionState
  isSessionLoading: boolean
}

interface ChatStoreActions {
  handleGetSession: (i: ChatItemType) => void
  handleLoadHistory: (c?: string) => void
}

const initState = {
  sessions: {},
  currentSession: {
    page: 1,
    size: 10,
    total: 0,
    hasMore: false,
    chatCode: '',
    list: [],
  },
  isSessionLoading: true,
}

export const useChatStore = create<ChatStoreState & ChatStoreActions>()(immer((set, get) => ({
  ...initState,
  async handleGetSession(i) {
    const { chatCode } = i

    // 切换时缓存上一个聊天记录
    set((state) => {
      const { currentSession } = get()
      state.sessions[currentSession.chatCode] = currentSession
      state.currentSession = {
        page: 1,
        size: 10,
        total: 0,
        chatCode: '',
        hasMore: false,
        list: [],
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
  async handleLoadHistory(chatCode: string = get().currentSession.chatCode) {
    const { currentSession: { page, size } } = get()
    const res = await fetchChatSession({
      page,
      size,
      chatCode,
    })

    set((state) => {
      state.currentSession.page = page + 1
      state.currentSession.hasMore = res.hasMore
      state.currentSession.list = [...res.list, ...state.currentSession.list]
      state.currentSession.chatCode = chatCode
      state.isSessionLoading = false
    })
  },
})))

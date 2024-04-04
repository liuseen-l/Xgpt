import { createStore } from 'zustand'

const useChatStore = createStore((get, set) => {
  return {
    gptCode: {
      code1: {
        chatCodeList: [],
        chatList: {
          chatCode1: {
            total: 10,
            page: 10,
            size: 1,
            list: [],
            hasMore: true,
          },
          chatCode2: {
            total: 10,
            page: 10,
            size: 1,
            list: [],
            hasMore: true,
          },
        },
      },
    },

  }
})

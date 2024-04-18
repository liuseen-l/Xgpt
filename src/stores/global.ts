import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import type { ResponseLogin } from '~/api/account/types'

type UserInfo = ResponseLogin['data']

type GlobalStoreState = Partial<{
  [k in keyof UserInfo]: UserInfo[k]
}>

interface GlobalStoreAction {
  handleSetUserInfo: (info: UserInfo) => void
  handleInit: () => void
}

const initState = {
  token: '',
  emial: '',
  username: '',
}

export const useGlobalStore = create<GlobalStoreState & GlobalStoreAction>()(devtools(persist((set, _get) => {
  return {
    ...initState,
    handleSetUserInfo(info) {
      const { token, username, email } = info

      set({
        token,
        username,
        email,
      })
    },
    handleInit() {
      set({
        ...initState,
      })
    },
  }
}, {
  name: 'globalStore',
  storage: createJSONStorage(() => localStorage),
})))

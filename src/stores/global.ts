import { create } from 'zustand'

interface GlobalStoreState {
  token: string | null
}

export const useGlobalStore = create<GlobalStoreState>((get, set) => {
  return {
    token: 'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAACXMOw6DMBAFwLu8msK7trGhzUlWXiOlCEY4URIQd-fXTjErJqn1W2ZFD_bqvShHK-KMkcG1LoVWA9lkgiga5N-EngJ5x8SdafCU9wUcubvgU_P8KJqPj9jihlFeJ6Tlj20HEpcQInMAAAA.rU9suc3frLRgaxPTGmLtFLRMLbWvGETdfYz64t0ckExy25wwIn9XvNH5KImOk9uTzBP_EgeSZtoSHRnRJG_fkg',
    // token: '',
  }
})

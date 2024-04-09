import { create } from 'zustand'

interface GlobalStoreState {
  token: string | null
  gptCode: string
}

export const useGlobalStore = create<GlobalStoreState>((get, set) => {
  return {
    token: 'eyJhbGciOiJIUzUxMiIsInppcCI6IkdaSVAifQ.H4sIAAAAAAAAACXMPQ6DMAwG0Lt8M0Ps2Amw9iRWnEodWhAB9U-9eyld3_DemK21-7Q4RrC6qjn30UxCsLMkKTl5plhCNkeH-pgxUiZlIdGhw8XWAzjJcMDW6nKavO4fccQfbnb9QXk98fkCDyhWRHMAAAA.AmhytDp5YvKa8A0YhN6TbdScd1NZ_E9afnCGra26iuHTOM5dRhfUNllxiQcINo0R0QaAqv1WfVKaaQkABdWH6g',
    gptCode: 'gpt_2',
  }
})

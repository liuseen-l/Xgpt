export interface RequestPPTOutline {
  isRebuild: boolean
  content: string
  cid: string
}

export interface ResponsePPTOutline {
  data: {
    outline: {
      subTitle: string
      chapters: {
        chapterTitle: string
        chapterContents: {
          chapterTitle: string
        }[]
      }[]
    }
    content: string
  }
}

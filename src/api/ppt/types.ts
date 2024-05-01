import type { ChatSessionItem } from '../chat/types'

/**
 * 生成ppt大纲
 */
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
          id: number
        }[]
        id: number
      }[]
    }
    content: string
  }
}

/**
 * 生成ppt
 */
export type RequestCreatePPT = ResponsePPTOutline['data'] & {
  cid: string
  isRebuild: boolean
  colorTheme?: string
}

export interface ResponseCreatePPT {
  data: ChatSessionItem
}

/**
 * ppt分类
 */

export interface ResponsePPTClassify {
  data: {
    firstKind: string
    secondKinds: string[]
  }[]
}

/**
 * ppt列表
 */
export interface RequestPPTList {
  page: number
  size: number
  firstKind: string
  secondKind: string
}

export interface ResponsePPTList {
  data: {
    total: number
    list: [
      {
        isCollected: boolean
        pptCode: string
        firstKind: string
        secondKind: string
        title: string
        content: null
        pptUrl: string
        coverUrl: string
        createTime: string
        updateTime: string
      },
    ]
  }
}

export interface RequestPPTCollect {
  pptCode: string
}

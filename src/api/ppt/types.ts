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
  keyword?: string
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
        score: number
        createTime: string
        updateTime: string
        collectAmount: number
        seeAmount: number
        username: string
        headshot: string
        commentAmount: number
        enableScore: boolean
        haveScored: boolean
      },
    ]
  }
}

/**
 * 收藏ppt
 */
export interface RequestPPTCollect {
  pptCode: string
  folderCode: string
}

export interface ResponsePPTCollect {
  data: string
}

/**
 * 获取文件夹列表
 */
export interface RequestPPTFolders {
  pptCode: string
}

export interface ResponsePPTFolders {
  data: {
    userCode: string
    folderCode: string
    folder: string
    amount: string
    isCollected: boolean
    createTime: string
    updateTime: string
  }[]
}

/**
 * 创建文件夹
 */
export interface RequestPPTCreateFolder {
  folder: string
}

/**
 * 获取某个文件夹下的ppt
 */
export interface RequestPPTCollectList {
  page: number
  size: number
  folderCode: string
}

export type ResponsePPTCollectList = ResponsePPTList
/**
 * 创建文件夹
 */
export interface RequestFolderDelete {
  folderCode: string
}

/**
 * 重命名文件夹
 */
export interface RequestFolderRename {
  folder: string
  folderCode: string
}

/**
 * 我的上传
 */
export interface RequestMyUpload {
  page: number
  size: number
}

export type ResponseMyUpload = ResponsePPTList

// export interface RequestPPTUpload {
//   firstKind: string
//   secondKind: string
//   pptFile: File
//   pptCoverFile: File
//   title: string
//   describtion?: string
// }

export interface RequestDeleteUpload {
  pptCode: string
}

export interface ResponseDeleteUpload {
  data: string
}

export interface ResponsePPTTheme {
  data: {
    id: number
    colorKey: string
    colorName: string
    thumbnail: string
  }[]
}

export interface RequestViewPPT {
  pptCode: string
}

export interface RequestCommentList {
  pptCode: string
  page: number
  size: number
}

export interface ResponseCommentList {
  data: {
    total: number
    hasMore: boolean
    list: {
      commentCode: string
      pptCode: string
      userCode: string
      username: string
      headshot: string
      content: string
      replyAmount: number
      createTime: string
    }[]
  }
}

export interface RequestReplyList {
  commentCode: string
  page: number
  size: number
}

export interface ResponseReplyList {
  data: {
    total: number
    hasMore: boolean
    list: {
      replyCode: string
      commentCode: string
      pptCode: string
      userCode: string
      username: string
      headshot: string
      content: string
      createTime: string
    }[]
  }
}

export interface RequestComment {
  pptCode: string
  content: string
}

export interface ResponseComment {
  data: {
    commentCode: string
    pptCode: string
    userCode: string
    username: string
    headshot: string
    content: string
    replyAmount: number
    createTime: string
  }
}

export interface RequestReply {
  commentCode: string
  pptCode: string
  content: string
}

export interface ResponseReply {
  data: {
    replyCode: string
    commentCode: string
    pptCode: string
    userCode: string
    username: string
    headshot: string
    content: string
    createTime: string
  }
}

export interface RequestScore {
  pptCode: string
  score1: number
  score2: number
  score3: number
}

export interface RequestPPTDetail {
  pptCode: string
}

export interface ResponsePPTDetail {
  data: {
    isCollected: boolean
    pptCode: string
    firstKind: string
    secondKind: string
    title: string
    content: null
    pptUrl: string
    coverUrl: string
    score: number
    createTime: string
    updateTime: string
    collectAmount: number
    seeAmount: number
    username: string
    headshot: string
    commentAmount: number
    enableScore: boolean
    haveScored: boolean
  }
}

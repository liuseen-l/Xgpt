/**
 * 聊天记录列表
 */

export interface RequestGetChatList {
  gptCode: string | null
}

export interface ChatItemType {
  chatAmount: number
  chatCode: string
  chatName: string
  createTime: string
  gptCode: string
  lastChatTime: string
}

export interface ResponseGetChatList {
  data: ChatItemType[]
}

/**
 * 聊天历史记录
 */
export interface RequestChatSession {
  chatCode: string
  page: number
  size: number
}

export interface ChatSessionItem {
  chatHeadshot: string
  userHeadshot: string
  userCode: string
  chatCode: string
  username: string
  chatName: string
  image: string
  question: string
  replication: string
}

export interface ResponseGetChatSession {
  data: {
    list: ChatSessionItem[]
    hasMore: boolean
    total: number
  }
}

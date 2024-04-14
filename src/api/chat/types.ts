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
  createTime: string
}

export interface ResponseGetChatSession {
  data: {
    list: ChatSessionItem[]
    hasMore: boolean
    total: number
    chatName: string
    functionCode: string
  }
}

/**
 * 发送消息
 */
export interface RequestPushSession {
  chatCode: string
  content: string
}

export interface ResponsePushSession {
  data: ChatSessionItem
}

/**
 * 获取功能列表
 */

export interface RequestGptFunction {
  gptCode: string
}

export interface GptFunctionItem {
  createTime: string
  functionCode: string
  functionName: string
  gptCode: string
  gptName: string
}

export interface ResponseGptFunction {
  data: GptFunctionItem[]
}

/**
 * 增加聊天
 */

export interface RequestAddChat {
  chatName: string
  gptCode: string
  functionCode: string
}

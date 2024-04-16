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

export enum functionCodeType {
  function1 = 'function_1',
  function2 = 'function_2',
  function3 = 'function_3',
  function4 = 'function_4',
}
export interface ResponseGetChatSession {
  data: {
    list: ChatSessionItem[]
    hasMore: boolean
    total: number
    chatName: string
    functionCode: functionCodeType
  }
}

/**
 * 发送消息(文本)
 */
export interface RequestPushSession {
  chatCode: string
  content: string
}

export interface ResponsePushSession {
  data: ChatSessionItem
}

/**
 * 发送消息(图片生成)
 *
 */
export interface RequestImageGen {
  chatCode: string
  content: string
}

export interface ResponseImageGen {
  data: ChatSessionItem
}

/**
 * 发送消息(PPT生成)
 *
 */
export interface RequestPPTGen {
  chatCode: string
  content: string
}

export interface ResponsePPTGen {
  data: ChatSessionItem
}

/**
 * 发送消息(图片理解)
 */

export interface RequestImageUnd {
  data: FormData
}

export interface ResponseImageUnd {
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
  functionCode: functionCodeType
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
  functionCode: functionCodeType
}

/**
 * 删除聊天
 *
 */
export interface RequestDeleteSession {
  chatCode: string
}

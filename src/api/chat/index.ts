import type { RequestAddChat, RequestChatSession, RequestGetChatList, RequestGptFunction, RequestPushSession, ResponseGetChatList, ResponseGetChatSession, ResponseGptFunction, ResponsePushSession } from './types'
import { useGetFecth } from '~/utils'
import request from '~/utils/request'

const API_URL = {
  CHAT_LIST: '/chat/create/list',
  CHAT_GET_HISTORY: '/chat/history',
  CHAT_PUSH_SESSION: '/chat/xf/question',
  CHAT_GET_FUNCTION: '/gpt/chat/function/list',
  CHAT_ADD: '/chat/add',
}

/**
 * 获取列表
 * @param params
 * @returns
 */
export async function fetchChatList(params: RequestGetChatList) {
  const res = await request.get<ResponseGetChatList>(API_URL.CHAT_LIST, {
    params,
  })
  return res.data.data
}

/**
 * 获取聊天记录
 * @param param
 * @returns
 */
export async function fetchChatSession(params: RequestChatSession) {
  const res = await request.get<ResponseGetChatSession>(API_URL.CHAT_GET_HISTORY, {
    params,
  })
  return res.data.data
}

/**
 * 发送消息
 * @param params
 */
export async function fetchPushSession(params: RequestPushSession) {
  const res = await request.post<ResponsePushSession>(API_URL.CHAT_PUSH_SESSION, params)
  return res.data.data
}

/**
 * 获取功能
 * @param params
 * @returns
 */
export function fetchGetFunction(params: RequestGptFunction) {
  return useGetFecth<ResponseGptFunction>(API_URL.CHAT_GET_FUNCTION, params)
}

export async function fetchCreateChat(params: RequestAddChat) {
  await request.post(API_URL.CHAT_ADD, params)
}

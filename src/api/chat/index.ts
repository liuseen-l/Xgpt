import type { RequestChatSession, RequestGetChatList, RequestPushSession, ResponseGetChatList, ResponseGetChatSession } from './types'
import { useGetFecth } from '~/utils'
import request from '~/utils/request'

const API_URL = {
  CHAT_LIST: '/chat/create/list',
  CHAT_GET_HISTORY: '/chat/history',
  CHAT_PUSH_SESSION: '/chat/xf/question',
}

/**
 * 获取列表
 * @param params
 * @returns
 */
export function fetchChatList(params: RequestGetChatList) {
  return useGetFecth<ResponseGetChatList>(API_URL.CHAT_LIST, params)
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
  return res?.data?.data
}

export async function fetchPushSession(params: RequestPushSession) {
  const res = await request.post(API_URL.CHAT_PUSH_SESSION, params)
  console.log(res)
}

import type { RequestChatSession, RequestGetChatList, ResponseGetChatList, ResponseGetChatSession } from './types'
import { useGetFecth } from '~/utils'
import request from '~/utils/request'

const API_URL = {
  CHAT_LIST: '/chat/create/list',
  CHAT_SESSIONS: '/chat/history',
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
  const res = await request.get<ResponseGetChatSession>(API_URL.CHAT_SESSIONS, {
    params,
  })
  return res?.data?.data
}

import type { RequestAddChat, RequestChatSession, RequestDeleteSession, RequestGetChatList, RequestGptFunction, RequestImageGen, RequestPPTGen, RequestPushSession, ResponseGetChatList, ResponseGetChatSession, ResponseGptFunction, ResponseImageGen, ResponsePPTGen, ResponsePushSession } from './types'
import { useGetFecth } from '~/utils'
import request from '~/utils/request'

const API_URL = {
  CHAT_LIST: '/chat/create/list',
  CHAT_GET_HISTORY: '/chat/history',
  CHAT_PUSH_SESSION: '/chat/xf/question',
  CHAT_GET_FUNCTION: '/gpt/chat/function/list',
  CHAT_ADD: '/chat/add',
  CHAT_DELETE: '/chat/delete',
  CHAT_IMAGE_GEN: '/chat/xf/image/create',
  CHAT_PPT_GEN: '/chat/xf/ppt/create',
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
 * 获取功能列表
 * @param params
 * @returns
 */
export function fetchGetFunction(params: RequestGptFunction) {
  return useGetFecth<ResponseGptFunction>(API_URL.CHAT_GET_FUNCTION, params)
}

/**
 * 创建对话
 * @param params
 */
export async function fetchCreateChat(params: RequestAddChat) {
  await request.post(API_URL.CHAT_ADD, params)
}

export async function fetchDeleteSession(params: RequestDeleteSession) {
  await request.get(API_URL.CHAT_DELETE, {
    params,
  })
}

/**
 * 发送消息
 * @param params
 */
export async function fetchPushTextSession(params: RequestPushSession) {
  const res = await request.post<ResponsePushSession>(API_URL.CHAT_PUSH_SESSION, params)
  return res.data.data
}

/**
 * 图片生成
 * @param params
 * @returns
 */
export async function fetchImageGen(params: RequestImageGen) {
  const res = await request.post<ResponseImageGen>(API_URL.CHAT_IMAGE_GEN, params)
  return res.data.data
}

export async function fetchPPTGen(params: RequestPPTGen) {
  const res = await request.post<ResponsePPTGen>(API_URL.CHAT_PPT_GEN, params)
  return res.data.data
}

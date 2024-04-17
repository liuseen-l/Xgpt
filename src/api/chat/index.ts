import type { RequestAddChat, RequestChatSession, RequestDeleteSession, RequestGetChatList, RequestGptFunction, RequestImageGen, RequestImageUnd, RequestPPTGen, RequestPushSession, ResponseGetChatList, ResponseGetChatSession, ResponseGptFunction, ResponseImageGen, ResponseImageUnd, ResponsePPTGen, ResponsePushSession } from './types'
import { useGetFecth } from '~/utils'
import request from '~/utils/request'

const API_URL = {
  CHAT_LIST: '/chat/create/list',
  CHAT_GET_HISTORY: '/chat/history',
  CHAT_GET_FUNCTION: '/gpt/chat/function/list',
  CHAT_ADD: '/chat/add',
  CHAT_DELETE: '/chat/delete',
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

/**
 * 删除对话
 * @param params
 */
export async function fetchDeleteSession(params: RequestDeleteSession) {
  await request.get(API_URL.CHAT_DELETE, {
    params,
  })
}

/**
 * 发送消息
 * @param params
 */
export async function fetchPushTextSession(url: string, params: RequestPushSession) {
  const res = await request.post<ResponsePushSession>(url, params)
  return res.data.data
}

/**
 * 图片生成
 * @param params
 * @returns
 */
export async function fetchImageGen(url: string, params: RequestImageGen) {
  const res = await request.post<ResponseImageGen>(url, params)
  return res.data.data
}

/**
 * ppt生成
 * @param params
 * @returns
 */
export async function fetchPPTGen(url: string, params: RequestPPTGen) {
  const res = await request.post<ResponsePPTGen>(url, params)
  return res.data.data
}

/**
 * 图片理解
 * @param params
 * @returns
 */
export async function fetchImageUnd(url: string, params: RequestImageUnd) {
  const res = await request.post<ResponseImageUnd>(url, params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data.data
}

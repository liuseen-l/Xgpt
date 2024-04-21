import type { RequestAddChat, RequestChatSession, RequestDeleteSession, RequestGetChatList, RequestGptFunction, RequestImageGen, RequestImageUnd, RequestPPTGen, RequestPresetList, RequestPushSession, RequestStopSend, ResponseAddChat, ResponseGetChatList, ResponseGetChatSession, ResponseGptFunction, ResponseImageGen, ResponseImageUnd, ResponsePPTGen, ResponsePresetList, ResponsePushSession } from './types'
import { useGetFecth } from '~/utils'
import request from '~/utils/request'

const API_URL = {
  CHAT_LIST: '/chat/create/list',
  CHAT_GET_HISTORY: '/chat/history',
  CHAT_GET_FUNCTION: '/gpt/chat/function/list',
  CHAT_ADD: '/chat/add',
  CHAT_DELETE: '/chat/delete',
  CHAT_PRESET: '/chat/default/list',
  CHAT_STOP: '/chat/request/stop',
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
 * 创建对话
 * @param params
 */
export async function fetchCreateChat(params: RequestAddChat) {
  const res = await request.post<ResponseAddChat>(API_URL.CHAT_ADD, params)
  return res.data.data
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

/**
 * 获取功能列表
 * @param params
 * @returns
 */
export function fetchGetFunction(params: RequestGptFunction) {
  return useGetFecth<ResponseGptFunction>(API_URL.CHAT_GET_FUNCTION, params)
}

/**
 * 获取预设列表
 * @param params
 * @returns
 */
export function fetchPresetList(params: RequestPresetList) {
  return useGetFecth<ResponsePresetList>(API_URL.CHAT_PRESET, params)
}

/**
 * 停止请求
 * @param params
 * @returns
 */
export async function fetchStopSend(params: RequestStopSend) {
  return request.get(API_URL.CHAT_STOP, {
    params,
  })
}

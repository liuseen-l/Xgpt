import type { RequestGetVerCode, ResponseGetVerCode } from './types'
import request from '~/utils/request'

const API_URL = {
  VER_CODE: '/user/send/email',
}

/**
 * 注册
 * @param params
 * @returns
 */
// export async function fetchRegiste(params: RequestGetChatList) {
//   const res = await request.get<ResponseGetChatList>(API_URL.CHAT_LIST, {
//     params,
//   })
//   return res.data.data
// }

/**
 * 获取验证码
 * @param params
 * @returns
 */
export async function fetchGetVerCode(params: RequestGetVerCode) {
  const res = await request.get<ResponseGetVerCode>(API_URL.VER_CODE, {
    params,
  })
  return res.data.data
}

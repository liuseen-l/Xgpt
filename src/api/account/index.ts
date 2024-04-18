import type { RequestFindAccount, RequestGetVerCode, RequestLoginByAccount, RequestLoginByEmail, RequestRegiste, ResponseGetVerInfo, ResponseLogin, ResponseRegiste } from './types'
import request from '~/utils/request'

export const ACCOUNT_API_URL = {
  VER_CODE: '/user/send/email',
  USER_REGISTER: '/user/register', // 注册
  LOGIN_EMAIL: '/user/login/by/verifyCode', // 快捷登录
  LOGIN_ACCOUNT: '/user/login/by/password', // 账号密码登录
  FIND_ACCOUNT: '/user/password/forget', // 找回账号
}

/**
 * 注册
 * @param params
 * @returns
 */
export async function fetchRegiste(params: RequestRegiste) {
  const res = await request.post<ResponseRegiste>(ACCOUNT_API_URL.USER_REGISTER, params)
  return res.data.data
}

/**
 * 获取验证码
 * @param params
 * @returns
 */
export async function fetchGetVerCode(params: RequestGetVerCode) {
  const res = await request.get<ResponseGetVerInfo>(ACCOUNT_API_URL.VER_CODE, {
    params,
  })
  return res.data.data
}

/**
 * 快捷登录
 * @param params
 * @returns
 */
export async function fetchLoginByEmail(params: RequestLoginByEmail) {
  const res = await request.post<ResponseLogin>(ACCOUNT_API_URL.LOGIN_EMAIL, params)
  return res.data.data
}

/**
 * 账号密码登录
 * @param params
 * @returns
 */
export async function fetchLoginByAccount(params: RequestLoginByAccount) {
  const res = await request.post<ResponseLogin>(ACCOUNT_API_URL.LOGIN_ACCOUNT, params)
  console.log(res)

  return res.data.data
}

/**
 * 找回密码
 * @param params
 * @returns
 */
export async function fetchFindAccount(params: RequestFindAccount) {
  const res = await request.post<ResponseLogin>(ACCOUNT_API_URL.FIND_ACCOUNT, params)
  return res.data.data
}

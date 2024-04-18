/**
 * 获取验证码
 */
export interface RequestGetVerCode {
  email: string
}

export interface ResponseGetVerInfo {
  data: {
    verifyCode: string
    preEmail: string
  }
}

/**
 * 注册
 */

export interface RequestRegiste {
  email: string
  userVerifyCode: string
  verifyCode: string
  preEmail: string
  username: string
  headShot?: string
  password: string
  againPassword: string
}

export interface ResponseRegiste {
  data: {
    email: string
    phone: null
    username: string
    headshot: null
    password: string
    token: string
  }
}

/**
 * 快捷登录
 */

export interface RequestLoginByEmail {
  email: string
  preEmail: string
  userVerifyCode: string
  verifyCode: string
}

export interface RequestLoginByAccount {
  email: string
  password: string
}

export interface ResponseLogin {
  data: {
    userCode: string
    email: string
    phone: null
    username: string
    headshot: string
    password: string
    token: string
  }
}

/**
 * 找回密码
 */

export interface RequestFindAccount {
  email: string
  userVerifyCode: string
  verifyCode: string
  preEmail: string
  password: string
  againPassword: string
}

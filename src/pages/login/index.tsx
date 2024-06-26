import clsx from 'clsx'
import { Button, Checkbox, Form, Input, Modal, Space } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { fetchGetVerCode, fetchLoginByAccount, fetchLoginByEmail } from '~/api/account'
import { useCount } from '~/utils'
import type { ResponseGetVerInfo } from '~/api/account/types'
import { useGlobalStore } from '~/stores/global'

enum LoginType {
  email,
  account,
}

function Login() {
  const [form] = Form.useForm()
  const [verInfo, setVerInfo] = useState<ResponseGetVerInfo['data']>({} as any)
  const { play, btnCount, isPlaying } = useCount()
  const [loginType, setLoginType] = useState(LoginType.email)

  const qrRef = useRef<HTMLImageElement>(null)

  const { handleSetUserInfo, handleReset } = useGlobalStore(state => ({
    handleSetUserInfo: state.handleSetUserInfo,
    handleReset: state.handleInit,
  }))

  const navigate = useNavigate()

  const onFinish = async (info: any) => {
    const { email, vercode: userVerifyCode, password } = info
    const { preEmail, verifyCode } = verInfo
    if (loginType === LoginType.email) {
      // 验证码登录
      const res = await fetchLoginByEmail({
        email,
        userVerifyCode,
        verifyCode,
        preEmail,
      })
      if (res) {
        handleSetUserInfo(res)
        navigate('/center')
      }
    }
    else {
      // 账号密码登录
      const res = await fetchLoginByAccount({
        email,
        password,
      })

      if (res) {
        handleSetUserInfo(res)
        navigate('/center')
      }
    }
  }

  const handleGetVerCode = () => {
    form.validateFields(['email']).then(async (r) => {
      if (!isPlaying.current) {
        play()
        const res = await fetchGetVerCode({
          email: r.email,
        })
        setVerInfo(res)
      }
    }).catch(() => { })
  }

  const handleToForget = () => {
    navigate('/forget', {
      replace: true,
    })
  }

  useEffect(() => {
    const item = localStorage.getItem('globalStore')
    if (!item)
      handleReset()
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    const createTime = Date.now()
    fetch(`http://124.71.110.30:3000/qrcode?createTime=${createTime}`).then(res => res.json()).then((res) => {
      qrRef.current!.src = res.code
    })
    const sse = new EventSource(`http://124.71.110.30:8080/user/login/by/scan/listen?&createTime=${createTime}`)
    window.qrEventSource = sse
    sse.addEventListener('message', (e) => {
      sse.close()
      const res = JSON.parse(e.data)
      if (res) {
        const { data: { token, email, username } } = res
        handleSetUserInfo({
          token,
          email,
          username,
          isLoginByAccount: false,
        } as any)
        navigate('/center')
      }
    })
    setIsModalOpen(true)
  }
  const handleCancel = () => {
    window.qrEventSource?.close()
    setIsModalOpen(false)
  }
  return (
    <div className="h-100vh w-100vw relative box-border">
      <Modal title="扫码登录" centered open={isModalOpen} footer={null} onCancel={handleCancel}>
        <div className={styles.qrcode}>
          <img src="" className="h-146px w-146px" ref={qrRef} alt="" />
        </div>
        <div className="text-[#666] fs-12 mt-12px">可以使用以下方式扫码登录</div>
        <div className="flex mt-10px fs-20 gap-3">
          <div className="i-mingcute:wechat-line text-green"></div>
          <div className="i-ant-design:alipay-circle-outlined text-#2e58ff"></div>
          <div className="i-logos:tiktok-icon"></div>
        </div>
        <div></div>
      </Modal>
      <div className={clsx('fixed left-0 right-0 top-0 bottom-0 bg-cover bg-no-repeat', styles.bg)}></div>
      <div className="pb-20px box-border w-480px px-40px rounded-12px absolute right-139px top-50% bg-[rgba(255,255,255,.9)] translate-y-[-50%]">
        {/* header */}
        <div className="mt-50px">
          <h3 className="fs-30 pm-0 pb-5px">
            {' '}
            {loginType === LoginType.email ? '邮箱快捷登录' : '账号密码登录'}
          </h3>
          <p className="fs-14 pm-0 text-#9B9B9B">
            <span
              className="text-#2e58ff cursor-pointer"
              onClick={() => {
                loginType === LoginType.email ? setLoginType(LoginType.account) : setLoginType(LoginType.email)
              }}
            >
              {loginType === LoginType.email ? '账号密码登录' : '邮箱快捷登录'}
            </span>
          </p>
        </div>
        {/* form */}
        <div className="mt-20px">
          {
            loginType === LoginType.email
              ? (
                <Form
                  form={form}
                  onFinish={onFinish}
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 200 }}
                  layout="vertical"
                  disabled={false}
                  style={{ maxWidth: 600 }}
                >
                  <Form.Item
                    hasFeedback
                    name="email"
                    label="邮箱号"
                    rules={[{ type: 'email', message: '邮箱格式不正确' }]}
                  >
                    <Input className="h-45px" placeholder="请输入邮箱号" />
                  </Form.Item>
                  <Form.Item
                    label="验证码"
                    name="vercode"
                    hasFeedback
                    rules={[
                      () => ({
                        validator(_, value) {
                          if (!value)
                            return Promise.reject(new Error('请输入验证码'))
                          if (!value.match(/^[0-9]{4}$/))
                            return Promise.reject(new Error('验证码格式错误'))
                          return Promise.resolve()
                        },
                      }),
                    ]}
                  >
                    <Space.Compact className="w-100%">
                      <Input className="h-45px" maxLength={4} placeholder="请输入邮箱验证码" />
                      <Button
                        disabled={
                          btnCount !== 10
                        }
                        className="h-45px"
                        type="primary"
                        onClick={handleGetVerCode}
                      >
                        {btnCount !== 10 ? `${btnCount}秒后重发` : '获取验证码'}
                      </Button>
                    </Space.Compact>
                  </Form.Item>
                  <Form.Item
                    name="agreement"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, value) =>
                          value ? Promise.resolve() : Promise.reject(new Error('请阅读并接受')),
                      },
                    ]}
                    className="flex jc-s ai-s"
                  >
                    <Checkbox>未注册的手机号将自动注册。勾选即代表您同意并接受服务协议与隐私政策</Checkbox>
                  </Form.Item>
                  <Form.Item className="flex jc-c ai-c">
                    <Button className="w-200px h-50px" type="primary" htmlType="submit">
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              )
              : (
                <>
                  <Form
                    form={form}
                    onFinish={onFinish}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 200 }}
                    layout="vertical"
                    disabled={false}
                    style={{ maxWidth: 600 }}
                  >
                    <Form.Item
                      hasFeedback
                      name="email"
                      label="邮箱号"
                      rules={[{ type: 'email', message: '邮箱格式不正确' }]}
                    >
                      <Input className="h-45px" placeholder="请输入邮箱号" />
                    </Form.Item>
                    <Form.Item
                      label="密  码"
                      name="password"
                      hasFeedback
                      rules={[
                        () => ({
                          validator(_, value) {
                            if (!value)
                              return Promise.reject(new Error('请输入登录密码'))
                            if (!value.match(/^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z]{6,20}$/))
                              return Promise.reject(new Error('请输入数字+字母，6-20位'))
                            return Promise.resolve()
                          },
                        }),
                      ]}
                    >
                      <Space.Compact className="w-100%">
                        <Input.Password className="h-45px" placeholder="设置登录密码(数字+字母,6-20位)" maxLength={20} minLength={6} />
                        <Button
                          disabled={
                            btnCount !== 10
                          }
                          className="h-45px"
                          type="primary"
                          onClick={handleToForget}
                        >
                          忘记密码?
                        </Button>
                      </Space.Compact>
                    </Form.Item>
                    <Form.Item className="flex jc-c ai-c">
                      <Button className="w-200px h-50px" type="primary" htmlType="submit">
                        登录
                      </Button>
                    </Form.Item>
                    <NavLink className="text-#566dff mt-[-10px] cursor-pointer flex jc-c fs-14 decoration-none" to="/register" replace>注册账号</NavLink>
                  </Form>
                </>
              )
          }
        </div>
        <div onClick={showModal} className={clsx('w-44px h-44px absolute bottom-0 right-0 cursor-pointer', styles.scan)}></div>
      </div>
    </div>
  )
}

export default Login

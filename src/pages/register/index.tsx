import clsx from 'clsx'
import { Button, Checkbox, Form, Input, Space } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'
import { fetchGetVerCode, fetchRegiste } from '~/api/account'
import { useCount } from '~/utils'
import type { ResponseGetVerInfo } from '~/api/account/types'

function Register() {
  const [form] = Form.useForm()
  const [verInfo, setVerInfo] = useState<ResponseGetVerInfo['data']>({} as any)
  const { play, btnCount, isPlaying } = useCount()

  const navigate = useNavigate()
  const handleJump = () => {
    navigate('/login', {
      replace: true,
    })
  }

  const onFinish = async (info: any) => {
    const { email, vercode: userVerifyCode, user: username, password, password2: againPassword } = info
    const { preEmail, verifyCode } = verInfo
    await fetchRegiste({
      email,
      userVerifyCode,
      verifyCode,
      preEmail,
      username,
      password,
      againPassword,
    })
    form.resetFields()
    handleJump()
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

  return (
    <div className="h-100vh w-100vw relative box-border">
      <div className={clsx('fixed left-0 right-0 top-0 bottom-0 bg-cover bg-no-repeat', styles.bg)}></div>
      <div className="pb-20px box-border w-480px px-40px rounded-12px absolute right-139px top-50% bg-[rgba(255,255,255,.9)] translate-y-[-50%]">
        <div className="mt-50px">
          <h3 className="fs-36 pm-0 pb-5px">欢迎注册</h3>
          <p className="fs-14 pm-0 text-#9B9B9B">
            已有账号？
            <span className="text-#2e58ff cursor-pointer" onClick={handleJump}>登录</span>
          </p>
        </div>
        <div className="box1 mt-20px">
          <Form
            form={form}
            onFinish={onFinish}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 200 }}
            layout="horizontal"
            disabled={false}
            style={{ maxWidth: 600 }}
          >
            <Form.Item
              name="user"
              label="用户名"
              hasFeedback
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value)
                      return Promise.reject(new Error('请输入用户名'))
                    return Promise.resolve()
                  },
                }),
              ]}
            >
              <Input className="h-45px" placeholder="请输入用户名" maxLength={50} minLength={1} />
            </Form.Item>
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
              <Input.Password className="h-45px" placeholder="设置登录密码(数字+字母,6-20位)" maxLength={20} minLength={6} />
            </Form.Item>
            <Form.Item
              label="确认密码"
              name="password2"
              dependencies={['password']}
              hasFeedback
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value)
                      return Promise.reject(new Error('请再次输入登录密码'))

                    if (getFieldValue('password') === value)
                      return Promise.resolve()

                    return Promise.reject(new Error('两次输入的密码不一致'))
                  },
                }),
              ]}
            >
              <Input.Password className="h-45px" placeholder="再次输入登录密码" maxLength={20} minLength={6} />
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
              <Checkbox>已阅读并接受Xgpt开放平台服务协议与隐私协议且保证您填写的注册信息中不得出现违法和不良信息</Checkbox>
            </Form.Item>
            <Form.Item className="flex jc-c ai-c">
              <Button className="w-200px h-50px" type="primary" htmlType="submit">
                注册
              </Button>
            </Form.Item>
          </Form>
        </div>

      </div>
    </div>
  )
}

export default Register

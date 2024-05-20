import type { MenuProps, UploadFile, UploadProps } from 'antd'
import { Avatar, Button, Form, Image, Input, Menu, Modal, Popover, Upload } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ImgCrop from 'antd-img-crop'
import styles from './home-nav.module.scss'
import { useGlobalStore } from '~/stores/global'
import { fetchPsRevise, fetchUserRevise } from '~/api/account'
import { useMessage } from '~/utils'
import type { FileType } from '~/utils/common'
import { getBase64, sleep } from '~/utils/common'

const items: MenuProps['items'] = [
  {
    label: '首页',
    key: 'center',
  },
  {
    label: '工具',
    key: 'chat',
  },
  {
    label: 'PPT创作',
    key: 'ppt/chat',
  },

]

const { success, error } = useMessage()

export const UserInfo: React.FC = () => {
  const navigate = useNavigate()
  const [psForm] = Form.useForm()
  const [userForm] = Form.useForm()

  const { isLogin, handleInit, headhot } = useGlobalStore(state => ({
    isLogin: state.username,
    handleInit: state.handleInit,
    headhot: state.headshot,
  }))

  const toLogin = () => {
    handleInit()
    navigate('/login')
  }
  const [psOpen, setIsPspen] = useState(false)

  const handlePsRevise = () => {
    psForm.validateFields(['oldPassword', 'newPassword', 'confirmPassword']).then(async () => {
      const { oldPassword, newPassword, confirmPassword } = psForm.getFieldsValue()
      const data = await fetchPsRevise({
        oldPassword,
        newPassword,
        confirmPassword,
      })
      if (data === '修改成功') {
        success(data)
        await sleep(1000)
        toLogin()
        setIsPspen(false)
        psForm.resetFields()
      }
      else {
        error('修改失败')
      }
    })
  }

  const [userOpen, setUserOpen] = useState(false)
  const { headhost, email, username, handleUpdateUserInfo } = useGlobalStore(state => ({
    headhost: state.headshot,
    email: state.email,
    username: state.username,
    handleUpdateUserInfo: state.handleUpdateUserInfo,
  }))
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'headhost',
      status: 'done',
      url: headhost,
    },
  ])

  const handleUserRevise = () => {
    userForm.validateFields(['username', 'headhost', 'email']).then(async () => {
      const { username, email } = userForm.getFieldsValue()
      const formData = new FormData()
      formData.append('username', username)
      formData.append('email', email)
      !fileList[0].url && formData.append('headhost', fileList[0].originFileObj as File)
      const data = await fetchUserRevise(formData)
      if (data) {
        success('信息修改成功')
        handleUpdateUserInfo(data)
        await sleep(500)
        setUserOpen(false)
        userForm.resetFields()
      }
      else {
        error('修改失败')
      }
    })
  }

  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const uploadProps: UploadProps = {
    fileList,
    maxCount: 1,
    onRemove: () => false,
    beforeUpload: (file) => {
      const isPic = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isPic)
        error(`请上传以png,jpg结尾的文件`)
      return isPic || Upload.LIST_IGNORE
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList)
    },
    onPreview: async (file: UploadFile) => {
      if (!file.url && !file.preview)
        file.preview = await getBase64(file.originFileObj as FileType)

      setPreviewImage(file.url || (file.preview as string))
      setPreviewOpen(true)
    },
    listType: 'picture-circle',
    customRequest: async (file: any) => {
      file.onProgress({
        percent: 20,
      })
      await sleep(1000)
      file.onProgress({
        percent: 100,
      })
      await sleep(200)
      file.onSuccess()
    },
  }
  return (
    <>

      <Modal
        title="个人资料"
        open={userOpen}
        okText="确定"
        cancelText="取消"
        onOk={handleUserRevise}
        onCancel={() => {
          userForm.resetFields()
          setFileList([{
            uid: '-1',
            name: 'headhost',
            status: 'done',
            url: headhost,
          }])
          setUserOpen(false)
        }}
      >
        <Form
          form={userForm}
          name="userRevise"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{
            remember: true,
            username,
            email,
          }}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              () => ({
                validator(_, value) {
                  if (!value)
                    return Promise.reject(new Error('请输入旧密码'))
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input placeholder="请输入用户名" maxLength={50} minLength={1} />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="email"
            rules={[{ type: 'email', message: '邮箱格式不正确' }]}
            hasFeedback
          >
            <Input placeholder="请输入邮箱号" />
          </Form.Item>
          <Form.Item
            label="头像"
            name="headhost"
          >
            <ImgCrop rotationSlider>
              <Upload
                {...uploadProps}
              >
                + 上传头像
              </Upload>

            </ImgCrop>
            {previewImage && (
              <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: visible => setPreviewOpen(visible),
                  afterOpenChange: visible => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="密码修改"
        open={psOpen}
        okText="确定"
        cancelText="取消"
        onOk={handlePsRevise}
        onCancel={() => {
          psForm.resetFields()
          setIsPspen(false)
        }}
      >
        <Form
          form={psForm}
          name="psRevise"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="输入旧密码"
            name="oldPassword"
            rules={[
              () => ({
                validator(_, value) {
                  if (!value)
                    return Promise.reject(new Error('请输入旧密码'))
                  return Promise.resolve()
                },
              }),
            ]}
          >
            <Input.Password placeholder="请输入旧密码" />
          </Form.Item>
          <Form.Item
            label="输入新密码"
            name="newPassword"
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
            <Input.Password placeholder="请输入数字+字母，6-20位" />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value)
                    return Promise.reject(new Error('请再次输入登录密码'))

                  if (getFieldValue('newPassword') === value)
                    return Promise.resolve()

                  return Promise.reject(new Error('两次输入的密码不一致'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="确认新密码" />
          </Form.Item>
        </Form>
      </Modal>
      {
        !isLogin?.length
          ? (
            <div className="flex gap-5px ">
              <Button onClick={() => navigate('/login')} className="bg-transparent important:hover:bg-[#f5f4f6] border-none important:hover:b-1-#c4c3c3 important:hover:text-black b-1-#c4c3c3">登录</Button>
              <Button onClick={() => navigate('/register')} className="border-none important:hover:bg-white important:hover:text-black">注册</Button>
            </div>
            )
          : (
            <Popover
              placement="bottom"
              content={(
                <>
                  <div className="px-10px cursor-pointer hover:text-blue mb-5px" onClick={() => setUserOpen(true)}>个人资料</div>
                  <div className="px-10px cursor-pointer hover:text-blue mb-5px" onClick={() => setIsPspen(true)}>修改密码</div>
                  <div className="px-10px cursor-pointer hover:text-blue mb-5px" onClick={toLogin}>退出登录</div>
                </>
              )}
            >
              <Avatar className="cursor-pointer mr-20px" src={headhot} />
            </Popover>
            )
      }

    </>
  )
}
const Nav: React.FC = () => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState<string>(items[0]!.key as string)

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
    if (e.key === 'chat')
      navigate(`/${e.key}/session?gptCode=gpt_2`)

    else
      navigate(`/${e.key}`)
  }

  return (
    <section className={clsx('w-100% max-w-100% sticky top-0 flex h-64px jc-b z-100 ai-c px-20px box-border', styles.wrapper)}>
      <div className="pl-100px flex flex-1 ai-c">
        <span className="fs-30 fw-700 mr-50px">Xgpt</span>
        <Menu onClick={onClick} className="w-250px border-b-none fs-16 bg-#e5f1ff" selectedKeys={[current]} mode="horizontal" items={items} />
      </div>
      <UserInfo></UserInfo>
    </section>
  )
}

export default Nav

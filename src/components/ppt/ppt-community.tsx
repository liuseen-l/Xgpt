import type { MenuProps, UploadProps } from 'antd'
import { Button, Col, Drawer, Form, Input, Menu, Row, Select, Space, Upload } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { UploadOutlined } from '@ant-design/icons'
import styles from './ppt-community.module.scss'
import { fetchPPTClassify, fetchPPTUpload } from '~/api/ppt'
import { resolvePPTKinds } from '~/api/ppt/helper'
import { useMessage } from '~/utils'
import { sleep } from '~/utils/common'
import { useGlobalStore } from '~/stores/global'

const { Option } = Select
type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem
}

const items: MenuProps['items'] = [
  getItem('首页推荐', 'center', <div className="i-solar-home-angle-2-bold-duotone"></div>),

  { type: 'divider' },
  getItem('我的资料库', 'sub2', <div className="i-solar-folder-with-files-bold-duotone"></div>, [getItem('我的收藏', 'like'), getItem('我的上传', 'upload')]),
]

const { error } = useMessage()
const Community: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const [classfiy, setClassify] = useState<Record<string, string[]>>({})
  const [secondList, setSecondList] = useState<string[]>([])
  const [firstList, setFirstList] = useState([])

  const { token } = useGlobalStore(state => ({
    token: state.token,
  }))

  const handleInit = async () => {
    const data = await fetchPPTClassify()
    if (!data)
      return
    const { firstKinds, secondKinds } = resolvePPTKinds(data)
    setFirstList(firstKinds)
    setClassify(secondKinds)
  }

  useEffect(() => {
    handleInit()
  }, [])

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'like' || e.key === 'upload') {
      if (!token) {
        navigate('/login')
        return
      }
    }
    navigate(`${e.key}`)
  }

  const pptFile: UploadProps = {
    maxCount: 1,
    beforeUpload: (file) => {
      const isPPT = file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      if (!isPPT)
        error(`请上传ppt文件`)
      return isPPT || Upload.LIST_IGNORE
    },
    async customRequest(file: any) {
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
  const pptCoverFile: UploadProps = {
    maxCount: 1,
    beforeUpload: (file) => {
      const isPic = file.type === 'image/jpg' || file.type === 'image/png'
      if (!isPic)
        error(`请上传以png,jpg结尾的文件`)
      return isPic || Upload.LIST_IGNORE
    },
    async customRequest(file: any) {
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

  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    if (!token) {
      navigate('/login')
      return
    }
    setOpen(true)
  }

  const onClose = () => {
    form.resetFields()
    setOpen(false)
  }

  const onFinish = async () => {
    form.validateFields(['firstKind', 'secondKind', 'pptFile', 'pptCoverFile', 'title']).then(async () => {
      const { title, firstKind, secondKind, pptCoverFile, pptFile } = form.getFieldsValue()
      const formData = new FormData()
      formData.append('title', title)
      formData.append('firstKind', firstKind)
      formData.append('secondKind', secondKind)
      formData.append('pptCoverFile', pptCoverFile.file.originFileObj as File)
      formData.append('pptFile', pptFile.file.originFileObj as File)
      try {
        await fetchPPTUpload(formData)
      }
      catch (e) {
        error('上传失败')
      }
      finally {
        setOpen(false)
        form.resetFields()
      }
    })
  }

  return (
    <div className={clsx('w-100% h-[calc(100vh-64px)] flex of-hidden box-border')}>
      <div className={clsx('w-100% flex-1 flex bg-#FBFCFD rounded-24px m-16px')}>
        {/* side-bar */}
        <div className="w-230px mr-16px bg-#FBFCFD  rounded-l-24px flex flex-col ai-c">
          <Button onClick={showDrawer} className="w-205px h-40px fw-700 mt-20px">上传文档</Button>
          <div className="w-100% px-10px flex jc-c mt-20px box-border">
            <Menu
              onClick={onClick}
              defaultSelectedKeys={['center']}
              defaultOpenKeys={['sub1', 'sub2']}
              mode="inline"
              items={items}
            />
          </div>
        </div>
        <Outlet></Outlet>
        <Drawer
          title="PPT模板上传"
          width={720}
          onClose={onClose}
          open={open}
          styles={{
            body: {
              paddingBottom: 80,
            },
          }}
          extra={(
            <Space>
              <Button onClick={onClose}>取消</Button>
              <Button onClick={onFinish} type="primary">
                完成
              </Button>
            </Space>
          )}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="title"
                  label="标题"
                  rules={[{ required: true, message: '请输入ppt名称' }]}
                >
                  <Input></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstKind"
                  label="一级类别"
                  rules={[{ required: true, message: '请选择一级类目' }]}
                >
                  <Select
                    placeholder="请选择"
                    onSelect={(i) => {
                      setSecondList(classfiy[i])
                    }}
                  >
                    {
                      firstList.map((i) => {
                        return <Option value={i} key={i}>{i}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="secondKind"
                  label="二级类别"
                  rules={[{ required: true, message: '请选择二级类目' }]}
                >
                  <Select placeholder="请选择">
                    {
                      secondList.map((i) => {
                        return <Option value={i} key={i}>{i}</Option>
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={20}>
              <Col span={24}>
                <Form.Item
                  name="description"
                  label="描述"
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                >
                  <Input.TextArea rows={4} placeholder="请描述一下ppt模板的内容...(非必填)" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="pptFile"
                  label="上传文件"
                  rules={[
                    {
                      required: true,
                      message: '请选择ppt文件',
                    },
                  ]}
                >
                  <Upload {...pptFile}>
                    <Button icon={<UploadOutlined />}>选择文件</Button>
                  </Upload>
                </Form.Item>
              </Col>

            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="pptCoverFile"
                  label="上传封面"
                  rules={[
                    {
                      required: true,
                      message: '请上传封面',
                    },
                  ]}
                >
                  <Upload {...pptCoverFile}>
                    <Button icon={<UploadOutlined />}>选择封面</Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Drawer>
      </div>

    </div>
  )
}

export default Community

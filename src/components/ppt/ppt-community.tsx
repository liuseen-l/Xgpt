import type { MenuProps } from 'antd'
import { Button, Col, DatePicker, Drawer, Form, Input, Menu, Row, Select, Space } from 'antd'
import type { SearchProps } from 'antd/es/input'
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import styles from './ppt-community.module.scss'

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

const { Search } = Input
const items: MenuProps['items'] = [
  getItem('首页推荐', 'center', <div className="i-solar-home-angle-2-bold-duotone"></div>),

  { type: 'divider' },
  getItem('我的资料库', 'sub2', <div className="i-solar-folder-with-files-bold-duotone"></div>, [getItem('我的收藏', 'like'), getItem('我的上传', 'upload')]),
]
const Community: React.FC = () => {
  const navigate = useNavigate()

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(`${e.key}`)
  }

  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value)

  return (
    <div className={clsx('w-100% flex-1 flex', styles.wrapper)}>
      {/* side-bar */}

      <div className="w-230px bg-#f5f5f5 flex flex-col ai-c">
        <Button onClick={showDrawer} className="w-205px h-40px fw-700 mt-20px">上传文档</Button>
        <div className="w-100% px-10px flex jc-c mt-20px box-border ">
          <Menu
            onClick={onClick}
            defaultSelectedKeys={['center']}
            defaultOpenKeys={['sub1', 'sub2']}
            mode="inline"
            items={items}
          />
        </div>
      </div>
      <div className="flex-1 h-[calc(100vh-64px)] flex flex-col">
        <div className={clsx('h-56px box-border flex ai-c pl-20px', styles.search)}>
          <Search
            style={{
              width: 600,
            }}
            placeholder="搜索文档"
            size="large"
            onSearch={onSearch}
          />
        </div>
        <Outlet></Outlet>
      </div>
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
            <Button onClick={onClose} type="primary">
              完成
            </Button>
          </Space>
        )}
      >
        <Form layout="vertical" hideRequiredMark>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstKind"
                label="一级类别"
                rules={[{ required: true, message: 'Please select an owner' }]}
              >
                <Select placeholder="请选择">
                  <Option value="xiao">Xiaoxiao Fu</Option>
                  <Option value="mao">Maomao Zhou</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="secondKind"
                label="二级类别"
                rules={[{ required: true, message: 'Please choose the type' }]}
              >
                <Select placeholder="请选择">
                  <Option value="private">Private</Option>
                  <Option value="public">Public</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="描述"
                rules={[
                  {
                    required: true,
                    message: 'please enter url description',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="请描述一下ppt模板的内容..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  )
}

export default Community

import type { MenuProps } from 'antd'
import { Button, Menu } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './home-nav.module.scss'

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
    label: 'PPT',
    key: 'ppt/chat',
  },
]

const Nav: React.FC = () => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(items[0]!.key)

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
    if (e.key === 'chat')
      navigate(`/${e.key}/session?gptCode=gpt_2`)

    else
      navigate(`/${e.key}`)
  }

  return (
    <section className={clsx('w-100% max-w-100% sticky top-0 flex h-64px jc-b z-100 ai-c px-20px box-border ', styles.wrapper)}>
      <div className="pl-100px flex flex-1 ai-c">
        <span className="fs-30 fw-700 mr-50px">Xgpt</span>
        <Menu onClick={onClick} className="w-200px border-b-none fs-16" selectedKeys={[current]} mode="horizontal" items={items} />
      </div>
      <div className="flex gap-5px ">
        <Button onClick={() => navigate('/login')} className="bg-transparent important:hover:bg-[#f5f4f6] border-none important:hover:b-1-#c4c3c3 important:hover:text-black b-1-#c4c3c3">登录</Button>
        <Button onClick={() => navigate('/register')} className="border-none important:hover:bg-white important:hover:text-black">注册</Button>
      </div>
    </section>
  )
}

export default Nav

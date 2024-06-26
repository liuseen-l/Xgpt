import type { MenuProps } from 'antd'
import { Menu } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserInfo } from '../home/home-nav'
import styles from './ppt-nav.module.scss'

const items: MenuProps['items'] = [
  {
    label: '首页',
    key: 'center',
  },
  {
    label: 'PPT社区',
    key: 'ppt/community',
  },
  {
    label: 'PPT创作',
    key: 'ppt',
  },
]

interface NavProps {
  className?: string
}

const Nav: React.FC<NavProps> = ({ className }) => {
  const navigate = useNavigate()
  const [current, setCurrent] = useState<string>(items[2]!.key as string)

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key)
    navigate(`/${e.key}`)
  }

  const location = useLocation()

  const isCommunity = () => {
    return !location.pathname.indexOf('/ppt/community')
  }

  return (
    <div
      style={{
        background: isCommunity() ? 'transparent' : 'white',
      }}
      className={clsx('w-100% sticky top-0 flex h-64px jc-b ai-c px-20px z-100 box-border', styles.wrapper, className)}
    >
      <div className="pl-100px flex flex-1 ai-c">
        <span className="fs-30 fw-700 mr-50px">Xgpt</span>
        <Menu onClick={onClick} className="w-250px border-b-none fs-16 bg-transparent" selectedKeys={[current]} mode="horizontal" items={items} />
      </div>
      <UserInfo></UserInfo>
    </div>
  )
}

export default Nav

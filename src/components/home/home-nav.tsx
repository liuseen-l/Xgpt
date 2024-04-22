import { Button } from 'antd'
import clsx from 'clsx'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './nav.module.scss'

const Nav: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className={clsx('w-100% max-w-100% sticky top-0 flex h-64px jc-b z-100 ai-c px-20px box-border ', styles.wrapper)}>
      <div className="fs-30 fw-700 pl-100px">Xgpt</div>
      <div className="flex gap-5px">
        <Button onClick={() => navigate('/login')} className="bg-transparent important:hover:bg-[#f5f4f6] border-none important:hover:b-1-#c4c3c3 important:hover:text-black b-1-#c4c3c3">登录</Button>
        <Button onClick={() => navigate('/register')} className="border-none important:hover:bg-white important:hover:text-black">注册</Button>
      </div>
    </section>
  )
}

export default Nav

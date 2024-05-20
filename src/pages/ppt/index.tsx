import React from 'react'
import { Outlet } from 'react-router-dom'
import clsx from 'clsx'
import styles from './ppt.module.scss'
import Nav from '~/components/ppt/ppt-nav'

const PPTHome: React.FC = () => {
  return (
    <div className={clsx('w-100% flex flex-col of-x-hidden min-h-100vh', styles.wrapper)}>
      <Nav className="important:bg-transparent"></Nav>
      <Outlet></Outlet>
    </div>
  )
}

export default PPTHome

import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '~/components/ppt/ppt-nav'

const PPTHome: React.FC = () => {
  return (
    <div className="w-100% of-x-hidden h-100vh relative flex flex-col">
      <Nav></Nav>
      <Outlet></Outlet>
    </div>
  )
}

export default PPTHome

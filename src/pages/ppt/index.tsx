import React from 'react'
import { Outlet } from 'react-router-dom'
import Nav from '~/components/ppt/ppt-nav'

const PPTHome: React.FC = () => {
  return (
    <div className="w-100% flex flex-col of-x-hidden min-h-100vh">
      <Nav></Nav>
      <Outlet></Outlet>
    </div>
  )
}

export default PPTHome

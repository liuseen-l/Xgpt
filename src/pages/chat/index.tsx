import { Outlet } from 'react-router-dom'
import SideBar from '~/components/chat/side-bar'
import ChatRoom from '~/components/chat/chat-room'

function Chat() {
  return (
    <div className="h-100vh w-100vw flex overflow-hidden relative">
      <SideBar></SideBar>
      <Outlet></Outlet>
    </div>
  )
}

export default Chat

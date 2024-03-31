import SideBar from '~/components/chat/SideBar'
import ChatRoom from '~/components/chat/ChatRoom'

function Chat() {
  return (
    <div className="h-100vh w-100vw flex">
      <SideBar></SideBar>
      <ChatRoom></ChatRoom>
    </div>
  )
}

export default Chat

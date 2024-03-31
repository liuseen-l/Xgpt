import SideBar from '~/components/chat/side-bar'
import ChatRoom from '~/components/chat/chat-room'

function Chat() {
  return (
    <div className="h-100vh w-100vw flex">
      <SideBar></SideBar>
      <ChatRoom></ChatRoom>
    </div>
  )
}

export default Chat

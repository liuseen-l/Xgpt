import SideBar from '~/components/chat/SideBar'
import SideChat from '~/components/chat/SideChat'

function Chat() {
  return (
    <div className="h-100vh w-100vw flex">
      <SideBar></SideBar>
      <SideChat></SideChat>
    </div>
  )
}

export default Chat

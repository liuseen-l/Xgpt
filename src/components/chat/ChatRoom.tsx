import ChatContent from './ChatContent'
import ChatHedaer from './ChatHeader'
import ChatInput from './ChatInput'

function ChatRoom() {
  return (
    <>
      <div className="flex flex-col flex-1 h-100% bg-base text-base">
        <ChatHedaer></ChatHedaer>
        <ChatContent></ChatContent>
        <ChatInput></ChatInput>
      </div>
    </>
  )
}

export default ChatRoom

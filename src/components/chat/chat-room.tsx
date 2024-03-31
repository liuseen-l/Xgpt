import ChatContent from './chat-content'
import ChatHedaer from './chat-header'
import ChatInput from './chat-input'

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

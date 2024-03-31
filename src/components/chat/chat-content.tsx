import ChatCard from './chat-card'

function SideChatContent() {
  return (
    <div className="w-100% flex-1 flex-col overflow-auto p-20px pb-40px box-border">
      <ChatCard></ChatCard>
    </div>
  )
}

export default SideChatContent

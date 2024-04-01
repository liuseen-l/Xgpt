import ChatCard from './chat-card'

function SideChatContent() {
  return (
    <div className="w-100% flex-1 flex-col overflow-auto p-20px pb-40px box-border">
      {
          Array.from({ length: 10 }).fill(null).map((_, i) => <ChatCard key={i}></ChatCard>)
        }
    </div>
  )
}

export default SideChatContent

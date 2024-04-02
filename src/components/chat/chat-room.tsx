import { useRef } from 'react'
import ChatInput from './chat-input'
import ChatCard from './chat-card'
import { useScrollToBottom, useToggle } from '~/utils'

function ChatRoom() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const isScrolledToBottom = scrollRef?.current
    ? Math.abs(
      scrollRef.current.scrollHeight
      - (scrollRef.current.scrollTop + scrollRef.current.clientHeight),
    ) <= 1
    : false

  const { scrollDomToBottom } = useScrollToBottom(
    scrollRef,
    isScrolledToBottom,
  )

  return (
    <>
      <div className="flex flex-col flex-1 h-100% bg-base text-base">
        <div className="w-100% py-14px px-20px flex box-border ai-c bborder-base">
          <div className="flex flex-col">
            <span className="fs-20 font-700 leading-9">新的聊天</span>
            <span className="fs-14">共4条对话</span>
          </div>
        </div>
        <div ref={scrollRef} className="w-100% flex-1 flex-col overflow-auto p-20px pb-40px box-border transition-all scroll-soomth">
          {
            Array.from({ length: 10 }).fill(null).map((_, i) => <ChatCard key={i}></ChatCard>)
          }
        </div>
        <ChatInput changeTheme={useToggle} scrollDomToBottom={scrollDomToBottom}></ChatInput>
      </div>
    </>
  )
}

export default ChatRoom

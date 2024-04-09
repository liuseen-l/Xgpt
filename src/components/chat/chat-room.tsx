import { useRef, useState } from 'react'
import { Skeleton, Spin } from 'antd'
import ChatInput from './chat-input'
import ChatCard from './chat-card'
import { useScrollToBottom, useToggle } from '~/utils'
import { useChatStore } from '~/stores/chat'

function ChatRoom() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isLoadMore, setLoadMore] = useState(false)
  // const isScrolledToBottom = scrollRef?.current
  //   ? Math.abs(
  //     scrollRef.current.scrollHeight
  //     - (scrollRef.current.scrollTop + scrollRef.current.clientHeight),
  //   ) <= 1
  //   : false
  // console.log('ref', scrollRef.current)

  // if (scrollRef.current)
  //   console.log('ref', scrollRef.current.scrollHeight, scrollRef.current.scrollTop, scrollRef.current.clientHeight)

  const { scrollDomToBottom } = useScrollToBottom(
    scrollRef,
    // isScrolledToBottom,
  )

  const { currentSession, handleLoadHistory, isSessionLoading } = useChatStore(state => ({
    currentSession: state.currentSession,
    handleLoadHistory: state.handleLoadHistory,
    isSessionLoading: state.isSessionLoading,
  }))

  const handleLoadMore = async () => {
    setLoadMore(true)
    await handleLoadHistory()
    setLoadMore(false)
  }

  return (
    <>
      <div className="flex flex-col flex-1 h-100% bg-base text-base">
        <div className="w-100% py-14px px-20px flex box-border ai-c bborder-base">
          <div className="flex flex-col">
            <span className="fs-20 font-700 leading-9">新的聊天</span>
            <span className="fs-14">
              共
              {currentSession.total}
              条对话
            </span>
          </div>
        </div>
        <div ref={scrollRef} className="w-100% flex-1 flex-col overflow-auto p-20px pb-40px box-border transition-all scroll-soomth">
          {
            !isSessionLoading
              ? isLoadMore
                ? (
                  <div className="flex ai-c jc-c">
                    <Spin tip="Loading" size="small"></Spin>
                  </div>
                  )
                : currentSession.hasMore && (
                  <div
                    className="flex ai-c jc-c text-base fs-12 cursor-pointer"
                    onClick={handleLoadMore}
                  >
                    查看更多
                  </div>
                )
              : false
          }
          {
            isSessionLoading
              ? (
                <>
                  <Skeleton className="mb-30px" avatar paragraph={{ rows: 4 }} />
                  <Skeleton avatar paragraph={{ rows: 4 }} />
                </>
                )
              : currentSession.list.map((i, idx) => <ChatCard key={idx} question={i.question} replication={i.replication}></ChatCard>)
          }
        </div>
        <ChatInput changeTheme={useToggle} scrollDomToBottom={scrollDomToBottom}></ChatInput>
      </div>
    </>
  )
}

export default ChatRoom

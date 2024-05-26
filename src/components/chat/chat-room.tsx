import { useContext, useRef, useState } from 'react'
import { Input, Modal, Skeleton, Spin } from 'antd'
import clsx from 'clsx'
import ChatInput from './chat-input'
import ChatCard from './chat-card'
import styles from './chat-room.module.scss'
import { ThemeInitContext, useScroll } from '~/utils'
import { useChatStore } from '~/stores/chat'

function ChatRoom() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isLoadMore, setLoadMore] = useState(false)

  const { handleToggle } = useContext(ThemeInitContext)
  // const isScrolledToBottom = scrollRef?.current
  //   ? Math.abs(
  //     scrollRef.current.scrollHeight
  //     - (scrollRef.current.scrollTop + scrollRef.current.clientHeight),
  //   ) <= 1
  //   : false
  // console.log('ref', scrollRef.current)

  // if (scrollRef.current)
  //   console.log('ref', scrollRef.current.scrollHeight, scrollRef.current.scrollTop, scrollRef.current.clientHeight)

  const { scrollDomToBottom } = useScroll(
    scrollRef,
    // isScrolledToBottom,
  )

  const { currentSession, handleLoadHistory, handleUpdateChatName, isSessionLoading } = useChatStore(state => ({
    currentSession: state.currentSession,
    handleLoadHistory: state.handleLoadHistory,
    isSessionLoading: state.isSessionLoading,
    handleUpdateChatName: state.handleUpdateChatName,
  }))

  const handleLoadMore = async () => {
    setLoadMore(true)
    await handleLoadHistory()
    setLoadMore(false)
  }

  const [isEditOpen, setIsEditOpen] = useState(false)

  const [chatName, setChatName] = useState<undefined | string>()

  return (
    <>
      <div className={clsx('flex flex-col flex-1 h-100% bg-base', styles.wrapper)}>
        <div className="w-100% py-14px px-20px flex box-border ai-c text-base bborder-base">
          <div className="flex flex-col flex-1">
            <div className="group flex ai-c gap-10px ">
              {
                isEditOpen
                  ? (
                    <Input
                      maxLength={12}
                      value={chatName}
                      defaultValue={currentSession.chatName}
                      onInput={(e) => {
                        // 名字不可以为空
                        if (e.currentTarget.value?.length > 0)
                          setChatName(e.currentTarget.value)
                      }}
                      className="w-200px h-30px mb-10px"
                      onBlur={() => {
                        // 点击编辑可能没有改动，那么不更新，否则会设置空
                        if (chatName?.length)
                          handleUpdateChatName(chatName as string)
                        setIsEditOpen(false)
                        // 切换的时候保证走defaultValue
                        setChatName(undefined)
                      }}
                    >
                    </Input>
                  )
                  : <span className="fs-20 font-700 h-40px flex ai-c">{currentSession.chatName}</span>

              }
              <div className="fs-14 group-hover:block hidden cursor-pointer i-material-symbols-edit-document-outline-sharp" onClick={() => setIsEditOpen(true)}></div>
            </div>
            <span className="fs-14">
              共
              {currentSession.list.length}
              条对话
            </span>
          </div>
        </div>
        <div ref={scrollRef} className="w-100% flex-1 flex-col overflow-auto p-20px pb-40px box-border transition-all">
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
                  <Skeleton active className="mb-30px" avatar paragraph={{ rows: 4 }} />
                  <Skeleton active avatar paragraph={{ rows: 4 }} />
                </>
              )
              : currentSession.list.map((i, idx) => <ChatCard supportResend={idx === currentSession.list.length - 1} key={idx} isDefault={i.isDefault} replyTime={i.replyTime} question={i?.question} createTime={i?.createTime} replication={i?.replication}></ChatCard>)
          }
        </div>
        <ChatInput changeTheme={handleToggle} scrollDomToBottom={scrollDomToBottom}></ChatInput>
      </div>
    </>
  )
}

export default ChatRoom

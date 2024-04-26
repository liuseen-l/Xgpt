import React from 'react'
import { useChatStore } from '~/stores/chat'
import ChatGptIcon from '~/asstes/icons/chatgpt'

interface Props {
  style?: React.CSSProperties
  onClick: () => void
  chatAmount: number // 对话数量
  chatName: string // 对话名称
  lastChatTime: string // 最后一次聊天时间
  chatCode: string
  shouldNarrow: boolean
  functionName: string
}

const SideItem: React.FC<Props> = ({ style, onClick: _onClick, lastChatTime, chatName, chatCode, chatAmount, functionName, shouldNarrow }) => {
  const { handleDeleteSession, handleGetChatList, handleCheckSession, currentSession } = useChatStore(state => ({
    handleDeleteSession: state.handleDeleteSession,
    handleCheckSession: state.handleCheckSession,
    handleGetChatList: state.handleGetChatList,
    currentSession: state.currentSession,

  }))

  const handleDelete = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    await handleDeleteSession(chatCode)
    const data = await handleGetChatList()
    if (currentSession.chatCode === chatCode)
      handleCheckSession(data[0])
  }

  return (
    <div
      onClick={_onClick}
      className="relative box-border mb-6px b-2-transparent border-rounded-3"
      style={style}
    >
      <div className="p-10px flex flex-col input-bg-base hover:bg-neutral-200 box-border dark:hover:bg-neutral-700 border-rounded-3 overflow-hidden cursor-pointer group">
        <div onClick={handleDelete} className="i-typcn:delete-outline absolute right-0 z-10 top-0 transition-all opacity-0 hover:opacity-100 group-hover:opacity-50 group-hover:translate-x-[-4px]"></div>
        {
          !shouldNarrow
            ? (
              <>
                <div className="mb-10px fw-700 fs-14 flex jc-b ai-c">
                  <span>{chatName}</span>
                  <span className="text-blue dark:text-[#1d93ab] transition-all fs-10 ">{functionName}</span>
                </div>
                <div className="w-100% flex jc-b sub-text-base fs-12">
                  <span>
                    {chatAmount}
                    条对话
                  </span>
                  <span className="">{lastChatTime}</span>
                </div>
              </>
              )
            : (
              <div className="w-36px h-36px transition-all flex jc-c ai-c group">
                <div className="group-hover:scale-80 group-hover:rotate-45 transition-all transition-duration-300 flex ai-c jc-c">
                  <div className="w-40px h-40px absolute scale-150 logo-bg-base">
                    <ChatGptIcon></ChatGptIcon>
                  </div>
                </div>
                <div className="absolute">{chatAmount}</div>
              </div>
              )
        }
      </div>

    </div>
  )
}

export default SideItem

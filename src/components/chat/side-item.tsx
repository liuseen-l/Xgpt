import React from 'react'

interface Props {
  style?: React.CSSProperties
  onClick: () => void
  chatAmount: number // 对话数量
  chatName: string // 对话名称
  lastChatTime: string // 最后一次聊天时间
}

const SideItem: React.FC<Props> = ({ style, onClick: _onClick, lastChatTime, chatName, chatAmount }) => {
  return (
    <div
      onClick={_onClick}
      className="relative box-border mb-6px b-2-transparent border-rounded-3"
      style={style}
    >
      <div className="p-10px flex flex-col bg-base hover:bg-neutral-200 dark:hover:bg-neutral-700 border-rounded-3 cursor-pointer group">
        <div className="i-typcn:delete-outline absolute right-0 top-0 transition-all opacity-0 hover:opacity-100 group-hover:opacity-50 group-hover:translate-x-[-4px]"></div>
        <span className="mb-10px font-700 fs-14">{chatName}</span>
        <div className="w-100% flex jc-b sub-text-base fs-12">
          <span>
            {chatAmount}
            条对话
          </span>
          <span className="">{lastChatTime}</span>
        </div>
      </div>
    </div>
  )
}

export default SideItem

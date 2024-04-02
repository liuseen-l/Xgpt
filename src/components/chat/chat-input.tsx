import { Input } from 'antd'
import React from 'react'
import ChatAction from './chat-action'
import { ACTIONS_CONFIGS } from '~/consts/action-configs'

function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
  console.log('Change:', e.target.value)
}

interface Props {
  scrollDomToBottom: () => void
  changeTheme: () => void
}

const ChatInput: React.FC<Props> = ({ scrollDomToBottom, changeTheme }) => {
  return (
    <div className="w-100% p-20px pt-10px tborder-base box-border">
      <div className="flex flex-col">
        <div className="mb-10px flex gap-6px">
          <ChatAction text={ACTIONS_CONFIGS.scroll.text} icon={ACTIONS_CONFIGS.scroll.inco} onClick={scrollDomToBottom} />
          <ChatAction text={ACTIONS_CONFIGS.theme.text} icon={ACTIONS_CONFIGS.theme.inco} onClick={changeTheme} />
        </div>
        <Input.TextArea
          onChange={onChange}
          placeholder="请输入内容......"
          className="bg-base hover:border-[#1d93ab] focus:border-[#1d93ab] dark:placeholder:text-neutral-600 text-base"
          style={{ minHeight: 150, maxHeight: 300 }}
        />
      </div>
    </div>
  )
}

export default ChatInput

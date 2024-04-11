import { Button, Input } from 'antd'
import React, { useRef, useState } from 'react'
import ChatAction from './chat-action'
import { ACTIONS_CONFIGS } from '~/consts/action-configs.tsx'
import { useChatStore } from '~/stores/chat'

interface Props {
  scrollDomToBottom: () => void
  changeTheme: () => void
}

const ChatInput: React.FC<Props> = ({ scrollDomToBottom, changeTheme }) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [userInput, setUserInput] = useState('')
  const { handlePushTextSeesion } = useChatStore(state => ({
    handlePushTextSeesion: state.handlePushTextSeesion,
  }))

  const handleSendMessage = async () => {
    setLoading(true)
    const c = userInput
    setUserInput('')
    await handlePushTextSeesion(c)
    setLoading(false)
  }

  const onInput = (text: string) => {
    setUserInput(text)
  }

  return (
    <div className="w-100% p-20px pt-10px tborder-base box-border">
      <div className="flex flex-col">
        <div className="mb-10px flex gap-6px">
          <ChatAction text={ACTIONS_CONFIGS.scroll.text} icon={ACTIONS_CONFIGS.scroll.inco} onClick={scrollDomToBottom} />
          <ChatAction text={ACTIONS_CONFIGS.theme.text} icon={ACTIONS_CONFIGS.theme.inco} onClick={changeTheme} />
        </div>
      </div>
      <div className="relative">
        <Input.TextArea
          value={userInput}
          onInput={e => onInput(e.currentTarget.value)}
          placeholder="请输入内容......"
          className="bg-base hover:border-[#d9d9d9] focus:border-[#1d93ab] dark:placeholder:text-neutral-600 text-base "
          style={{ minHeight: 150, maxHeight: 300 }}
        >
        </Input.TextArea>
        <Button onClick={handleSendMessage} className="bg-[#1d93ab] border-none text-white important:hover:bg-[#1d93ab] hover:filter-brightness-90 important:hover:text-white fs-12 absolute z-100 bottom-10px right-10px" loading={loading}>
          发送
        </Button>
      </div>
    </div>
  )
}

export default ChatInput

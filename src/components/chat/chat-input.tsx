import { Input } from 'antd'
import ChatAction from './chat-action'

function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
  console.log('Change:', e.target.value)
}
function ChatInput() {
  return (
    <div className="w-100% p-20px pt-10px tborder-base box-border">
      <div className="flex flex-col">
        <div className="mb-10px">
          <ChatAction />
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

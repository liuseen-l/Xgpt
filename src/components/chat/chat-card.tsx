import clsx from 'clsx'
import React from 'react'
import { Avatar } from 'antd'
import { Markdown } from './chat-markdown'
import styles from './chat-room.module.scss'
import { useChatStore } from '~/stores/chat'
import { useGlobalStore } from '~/stores/global'

interface ChatCardItemProps {
  content: string
  isUser?: boolean
  time: string
  supportResend: boolean
  question?: string
  isDefault: null | number
}

const ChatCardItem: React.FC<ChatCardItemProps> = ({ content, time, isUser, isDefault, supportResend, question }) => {
  const { handleSendSeesion } = useChatStore(state => ({
    handleSendSeesion: state.handleSendSeesion,
  }))
  const { headshot } = useGlobalStore(state => ({
    headshot: state.headshot,
  }))
  return (
    <div className={clsx('w-100% flex mb-25px card-text-base', isUser && 'jc-e', styles['chat-message'])}>
      <div className={clsx('max-w-80% flex flex-col gap-8px', isUser && 'ai-e')}>
        {/* header icon */}
        <div className="h-30px w-30px flex ai-c jc-c">
          {
            isUser
              ? headshot?.length
                ? <Avatar className="cursor-pointer" src={headshot} />
                : <div className="i-emojione:blond-haired-person-medium-light-skin-tone fs-20" />
              : <div className="i-arcticons:openai-chatgpt fs-20" />
          }
        </div>
        {/* content */}
        <div className={clsx('border-base fs-15 lh-6 leading-5 border-rounded-2 px-10px', isUser ? 'bubble-bg-base-user' : 'bubble-bg-base')}>
          <Markdown
            isUser={isUser}
            content={content}
          >
          </Markdown>
        </div>
        <div className="fs-12 sub-text-base">{time}</div>
        {(!isUser && supportResend && !isDefault) && (
          <div
            className="fs-12 cursor-pointer resend-text-base"
            onClick={() => {
              handleSendSeesion(question || '请重新生成', [], true)
            }}
          >
            重新生成
          </div>
        )}
      </div>
    </div>

  )
}

interface ChatCardProps {
  question: string
  replication: string
  createTime: string
  supportResend: boolean
  replyTime: string
  isDefault: null | number
}

const ChatCard: React.FC<ChatCardProps> = ({ question, supportResend, isDefault, replyTime, replication, createTime }) => {
  return (
    <>
      {!!question?.length && <ChatCardItem supportResend={supportResend} isDefault={isDefault} content={question} isUser time={createTime}></ChatCardItem>}
      {!!replication?.length && <ChatCardItem supportResend={supportResend} isDefault={isDefault} content={replication} question={question} time={replyTime}></ChatCardItem>}
    </>
  )
}
export default ChatCard

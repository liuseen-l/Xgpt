import clsx from 'clsx'
import React from 'react'
import { Markdown } from './chat-markdown'
import styles from './chat-room.module.scss'

interface ChatCardItemProps {
  content: string
  isUser?: boolean
  createTime: string
}

const ChatCardItem: React.FC<ChatCardItemProps> = ({ content, createTime, isUser }) => {
  return (
    <div className={clsx('w-100% flex mb-25px card-text-base', isUser && 'jc-e', styles['chat-message'])}>
      <div className={clsx('max-w-80% flex flex-col gap-8px', isUser && 'ai-e')}>
        {/* header icon */}
        <div className="h-30px w-30px flex ai-c jc-c border-base border-rounded-2">
          {
            isUser
              ? <div className="i-emojione:blond-haired-person-medium-light-skin-tone fs-20" />
              : <div className="i-arcticons:openai-chatgpt fs-20" />
          }
        </div>
        {/* content */}
        <div className={clsx('border-base fs-14 leading-5 border-rounded-2 px-10px', isUser ? 'bubble-bg-base-user' : 'bubble-bg-base')}>
          <Markdown
            content={content}
          >
          </Markdown>
        </div>
        <div className="fs-12 sub-text-base">{createTime}</div>
      </div>
    </div>

  )
}

interface ChatCardProps {
  question: string
  replication: string
  createTime: string
}

const ChatCard: React.FC<ChatCardProps> = ({ question, replication, createTime }) => {
  return (
    <>
      { !!question?.length && <ChatCardItem content={question} isUser createTime={createTime}></ChatCardItem>}
      { !!replication?.length && <ChatCardItem content={replication} createTime={createTime}></ChatCardItem>}
    </>
  )
}
export default ChatCard

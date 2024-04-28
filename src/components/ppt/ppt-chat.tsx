import React from 'react'
import clsx from 'clsx'
import styles from './ppt-chat.module.scss'
import Card from './ppt-card'

const Chat: React.FC = () => {
  return (
    <div className={clsx('flex-1 pt-40px pb-9px', styles.wrapper)}>
      <div className="h-100% w-960px overflow-y-auto  m-auto">
        <Card></Card>
      </div>
    </div>
  )
}

export default Chat

import clsx from 'clsx'
import React from 'react'
import { Input } from 'antd'
import styles from './ppt-card.module.scss'

interface CardItemProps {
  isUser?: boolean
  children?: React.ReactNode
}

const CardItem: React.FC<CardItemProps> = ({ isUser, children }) => {
  return (
    <div className={clsx('max-w-720px mb-16px p-12px rounded-10px text-#222 fs-14', !isUser ? 'rounded-bl-0 bg-#eff7ff w-fit' : 'bg-#fff w-720px rounded-br-0 float-right', styles.wrapper)}>
      {
        children
      }
    </div>
  )
}

const Card: React.FC = () => {
  return (
    <>
      <CardItem>
        <div className="flex ai-c gap-8px jc-c overflow-hidden">
          <div className="i-streamline-emojis-robot-face-1 fs-16 "></div>
          <div className="mt-3px">Hi👋我是你的百度 AI 小助手，今天你想创作什么主题的 PPT 呢？我都可以帮到你哦~</div>
        </div>
      </CardItem>
      <CardItem isUser>
        <Input
          placeholder="请输入你想创作的主题"
          showCount
          maxLength={400}
          suffix={
            <div className="i-mingcute-send-plane-fill fs-20 color-#a7ccf3"></div>
          }
        />
        <div className="fs-12 text-#666 mt-12px lh-16px">猜你想创作的PPT主题：</div>
      </CardItem>

    </>
  )
}

export default Card

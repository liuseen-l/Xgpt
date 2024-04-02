import clsx from 'clsx'
import React from 'react'

const ChatCard: React.FC = () => {
  const isTarget = Math.random() * 10 < 5

  return (
    <div className={clsx('w-100% flex mb-25px', isTarget && 'jc-e')}>
      <div className={clsx('max-w-80% flex flex-col gap-8px', isTarget && 'ai-e')}>
        {/* header icon */}
        <div className="h-30px w-30px flex ai-c jc-c border-base border-rounded-2">
          <div className="i-emojione:blond-haired-person-medium-light-skin-tone fs-20" />
        </div>
        {/* content */}
        <div className="border-base fs-14 leading-5 border-rounded-2 p-10px bubble-bg-base">
          我怕我怕我怕我怕我怕我怕我怕我怕我dwadwadawdawdwa怕我怕我怕我怕我怕我怕我怕
        </div>
        <div className="fs-12 sub-text-base">2024/03/12 13:23:31</div>
      </div>
    </div>

  )
}
export default ChatCard

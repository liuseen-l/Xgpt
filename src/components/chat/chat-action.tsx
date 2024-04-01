import { useRef, useState } from 'react'
import styles from './chat-action.module.scss'
import { useToggle } from '~/utils'

function ChatAction() {
  const iconRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState({
    full: 15,
    icon: 14.4,
  })

  function updateWidth() {
    if (!iconRef.current || !textRef.current)
      return
    const getWidth = (dom: HTMLDivElement) => dom.getBoundingClientRect().width
    const textWidth = getWidth(textRef.current)
    const iconWidth = getWidth(iconRef.current)

    setWidth({
      full: textWidth + iconWidth,
      icon: iconWidth,
    })
  }

  return (
    <div
      className={`${styles['chat-input-action']} transition-all fs-12 flex py-4px px-10px ai-c overflow-hidden h-16px shadow-sm b-1-rgb(222,222,222) border-rounded-20px hover:cursor-pointer action-base`}
      onClick={() => {
        useToggle()
      }}
      onMouseEnter={updateWidth}
      onTouchStart={updateWidth}
      style={
        {
          '--icon-width': `${width.icon}px`,
          '--full-width': `${width.full}px`,
        } as React.CSSProperties
      }
    >
      <div ref={iconRef} className="i-carbon-sun dark:i-carbon-moon text-base" />
      <div className={`${styles.text} pl-5px whitespace-nowrap text-base opacity-0 transform-translate-x-[-5px]`} ref={textRef}>
        切换模式
      </div>
    </div>
  )
}

export default ChatAction

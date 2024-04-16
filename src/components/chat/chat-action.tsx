import React, { useRef, useState } from 'react'

interface Props {
  text: string
  icon: JSX.Element
  onClick?: () => void
}

const ChatAction: React.FC<Props> = ({ text, onClick: _onClick, icon }) => {
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
      className="w-[var(--icon-width)] hover:w-[--full-width] border-base transition-width fs-12 flex py-4px px-10px ai-c overflow-hidden h-16px shadow-sm b-1-rgb(222,222,222) border-rounded-20px hover:cursor-pointer action-base group"
      onClick={() => {
        _onClick && _onClick()
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
      <div ref={iconRef}>
        {icon}
      </div>
      <div className="group-hover:opacity-100 group-hover:translate-0 pl-5px whitespace-nowrap text-base opacity-0 transform-translate-x-[-5px]" ref={textRef}>
        {text}
      </div>
    </div>
  )
}

export default ChatAction

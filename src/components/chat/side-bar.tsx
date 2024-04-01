import { useEffect, useRef, useState } from 'react'
import SideHistory from './side-history'
import styles from './side-bar.module.scss'
import ChatGptIcon from '~/asstes/icons/chatgpt'

export const MIN_SIDEBAR_WIDTH = 250
export const MAX_SIDEBAR_WIDTH = 500
export const DEFAULT_SIDEBAR_WIDTH = 300

function SideBar() {
  const startX = useRef(0)
  const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x)
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const startDragWidth = useRef(DEFAULT_SIDEBAR_WIDTH)

  const onDragStart = (e: MouseEvent) => {
    // Remembers the initial width each time the mouse is pressed
    startX.current = e.clientX
    startDragWidth.current = sidebarWidth

    const handleDragMove = (e: MouseEvent) => {
      const d = e.clientX - startX.current

      const nextWidth = limit(startDragWidth.current + d)

      const update = () => {
        if (nextWidth < MIN_SIDEBAR_WIDTH)
          setSidebarWidth(MIN_SIDEBAR_WIDTH)
        else
          setSidebarWidth(nextWidth)
      }
      update()
    }

    const handleDragEnd = () => {
      window.removeEventListener('pointermove', handleDragMove)
      window.removeEventListener('pointerup', handleDragEnd)
    }

    window.addEventListener('pointermove', handleDragMove)
    window.addEventListener('pointerup', handleDragEnd)
  }

  useEffect(() => {
    const barWidth = limit(sidebarWidth ?? DEFAULT_SIDEBAR_WIDTH)
    const sideBarWidth = `${barWidth}px`
    document.documentElement.style.setProperty('--sidebar-width', sideBarWidth)
  }, [sidebarWidth])

  return (
    <div className={`${styles.sidebar} flex flex-col h-100% text-base siderbar-bg-base select-none p-20px box-border relative`}>
      {/* header */}
      <div className="flex jc-b ai-c mb-20px">
        <div className="flex flex-col">
          <span className="fs-28 font-700 leading-14">Xgpt</span>
          <span className="fs-13">下一代 Chatgpt 集成平台</span>
        </div>
        <span className="w-80px h-80px fill-#8bcae0 switch-animation dark:fill-neutral-700">
          <ChatGptIcon></ChatGptIcon>
        </span>
      </div>
      {/* history */}
      <div className="flex-1 w-100% overflow-scroll">
        {
          Array.from({ length: 10 }).fill(null).map(() => <SideHistory></SideHistory>)
        }
      </div>

      {/* footer */}
      <div className="w-100% h-50px"></div>
      <div
        className={`${styles['sidebar-drag']} w-14px absolute top-0 right-0 h-100% flex jc-c ai-c`}
        onPointerDown={e => onDragStart(e as any)}
      >
        <div className="icon i-radix-icons:drag-handle-dots-2 ml-[-2px]"></div>
      </div>
    </div>
  )
}

export default SideBar

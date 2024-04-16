import { useEffect, useRef, useState } from 'react'
import { Button, Skeleton } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SideItem from './side-item'
import styles from './side-bar.module.scss'
import ChatGptIcon from '~/asstes/icons/chatgpt'
// import { useGlobalStore } from '~/stores/global'
import type { ChatItemType } from '~/api/chat/types'
import { useChatStore } from '~/stores/chat'

const MIN_SIDEBAR_WIDTH = 280
const MAX_SIDEBAR_WIDTH = 500
const DEFAULT_SIDEBAR_WIDTH = 300

const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x)

function SideBar() {
  const startX = useRef(0)
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const startDragWidth = useRef(DEFAULT_SIDEBAR_WIDTH)

  const [search] = useSearchParams()
  const gptCode = search.get('gptCode')!

  const { handleCheckSession, handleGetChatList, handleInit, sideList, isLoading, currentSession } = useChatStore(state => ({
    handleCheckSession: state.handleCheckSession,
    handleLoadHistory: state.handleLoadHistory,
    handleGetChatList: state.handleGetChatList,
    handleInit: state.handleInit,
    sideList: state.sideList,
    isLoading: state.isSideListLoading,
    currentSession: state.currentSession,
  }))

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

  const init = async () => {
    handleInit({
      gptCode,
    })

    const data = await handleGetChatList()
    handleCheckSession(data[0])
  }
  // 获取默认聊天记录
  useEffect(() => {
    init()
  }, [])

  const handleSelect = (i: ChatItemType) => {
    if (i.chatCode !== currentSession.chatCode)
      handleCheckSession(i)
  }

  const navigate = useNavigate()
  const handleJump = () => {
    navigate('addpanel')
  }

  return (
    <div className="w-[var(--sidebar-width)] flex flex-col h-100% text-base siderbar-bg-base select-none p-20px box-border relative">
      {/* header */}
      <div className="flex jc-b ai-c mb-20px">
        <div className="flex flex-col">
          <span className="fs-28 font-700 leading-14">Xgpt</span>
          <span className="fs-13">下一代 Chatgpt 集成平台</span>
        </div>
        <span className="w-80px h-80px logo-bg-base">
          <ChatGptIcon></ChatGptIcon>
        </span>
      </div>
      {/* history */}
      <div className="flex-1 w-100% overflow-auto">
        {
          isLoading
            ? <Skeleton paragraph={{ rows: 15 }} className={styles.skin} />
            : sideList.map((i, idx) => (
              <SideItem
                chatAmount={i.chatAmount}
                chatName={i.chatName}
                lastChatTime={i.createTime}
                chatCode={i.chatCode}
                style={{
                  border: `2px solid ${i.chatCode === currentSession.chatCode ? '#1d93ab' : 'transparent'}`,
                }}
                onClick={() => { handleSelect(i) }}
                key={idx}
              >
              </SideItem>
            ))
        }
      </div>
      {/* footer */}
      <div className="w-100% h-50px flex jc-e ai-c">
        <Button onClick={handleJump} className="fs-12 flex ai-c jc-b p-8px gap-5px text-base btn-base">
          <div className="i-ant-design:plus-circle-outlined"></div>
          <span>新建聊天</span>
        </Button>
      </div>
      {/* darg bar */}
      <div
        className="bg-transparent cursor-ew-resize w-14px absolute top-0 right-0 h-100% flex jc-c ai-c group"
        onPointerDown={e => onDragStart(e as any)}
      >
        <div className="i-radix-icons:drag-handle-dots-2 ml-[-2px] opacity-0 sub-text-base group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  )
}

export default SideBar

import { useContext, useEffect, useRef, useState } from 'react'
import { Button, Skeleton } from 'antd'
import { useNavigate, useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import SideItem from './side-item'
import styles from './antd.module.scss'
import ChatGptIcon from '~/asstes/icons/chatgpt'
import type { ChatItemType } from '~/api/chat/types'
import { useChatStore } from '~/stores/chat'
import { ThemeInitContext } from '~/utils'

const MIN_SIDEBAR_WIDTH = 280
const MAX_SIDEBAR_WIDTH = 500
const DEFAULT_SIDEBAR_WIDTH = 300
export const NARROW_SIDEBAR_WIDTH = 100

const limit = (x: number) => Math.min(MAX_SIDEBAR_WIDTH, x)

function SideBar() {
  const startX = useRef(0)
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH)
  const startDragWidth = useRef(DEFAULT_SIDEBAR_WIDTH)

  const { isDark } = useContext(ThemeInitContext)
  const [search] = useSearchParams()
  const gptCode = search.get('gptCode')!
  const lastUpdateTime = useRef(Date.now())
  const { handleCheckSession, handleGetChatList, handleInit, sideList, isLoading, currentSession } = useChatStore(state => ({
    handleCheckSession: state.handleCheckSession,
    handleLoadHistory: state.handleLoadHistory,
    handleGetChatList: state.handleGetChatList,
    handleInit: state.handleInit,
    sideList: state.sideList,
    isLoading: state.isSideListLoading,
    currentSession: state.currentSession,
  }))

  const toggleSideBar = () => {
    if (sidebarWidth < MIN_SIDEBAR_WIDTH)
      setSidebarWidth(DEFAULT_SIDEBAR_WIDTH)
    else
      setSidebarWidth(NARROW_SIDEBAR_WIDTH)
  }
  const onDragStart = (e: MouseEvent) => {
    // 记录光标开始的位置
    startX.current = e.clientX
    startDragWidth.current = sidebarWidth
    const dragStartTime = Date.now()
    const handleDragMove = (e: MouseEvent) => {
      if (Date.now() < lastUpdateTime.current + 20)
        return

      lastUpdateTime.current = Date.now()
      // 记录光标移动的距离
      const d = e.clientX - startX.current

      const nextWidth = limit(startDragWidth.current + d)

      if (nextWidth < MIN_SIDEBAR_WIDTH)
        setSidebarWidth(NARROW_SIDEBAR_WIDTH)
      else
        setSidebarWidth(nextWidth)
    }

    const handleDragEnd = () => {
      window.removeEventListener('pointermove', handleDragMove)
      window.removeEventListener('pointerup', handleDragEnd)
      const shouldFireClick = Date.now() - dragStartTime < 300
      if (shouldFireClick)
        toggleSideBar()
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
    navigate(`addpanel?gptCode=${gptCode}`)
  }

  const shouldNarrow = sidebarWidth < MIN_SIDEBAR_WIDTH

  return (
    <div className={clsx('w-[var(--sidebar-width)] h-100%', styles.sidebar)}>
      {/* header */}
      <div className="text-base siderbar-bg-base flex rounded-r-8 flex-col select-none p-20px box-border relative w-100% h-100%">
        <div className="flex jc-b ai-c mb-20px">
          {
            !shouldNarrow && (
              <div className="flex flex-col">
                <span className="fs-28 font-700 leading-14">Xgpt</span>
                <span className="fs-13">下一代 Chatgpt 集成平台</span>
              </div>
            )
          }
          <span className="w-80px h-80px logo-bg-base">
            <ChatGptIcon></ChatGptIcon>
          </span>
        </div>
        {/* history */}
        <div className="flex-1 w-100% of-y-auto of-x-hidden ">
          {
            isLoading
              ? <Skeleton active paragraph={{ rows: 15 }} className={styles.skin} />
              : sideList.map((i, idx) => (
                <SideItem
                // 同步数据
                  chatAmount={currentSession.chatCode === i.chatCode ? currentSession.list.length : i.chatAmount}
                  chatName={i.chatName}
                  lastChatTime={i.createTime}
                  chatCode={i.chatCode}
                  shouldNarrow={shouldNarrow}
                  functionName={i.functionName}
                  style={{
                    '--card-border': `${isDark ? '#1d93ab' : '#0099ff'}`,
                    'border': `2px solid ${i.chatCode === currentSession.chatCode ? 'var(--card-border)' : 'transparent'}`,
                  } as React.CSSProperties}
                  onClick={() => { handleSelect(i) }}
                  key={idx}
                >
                </SideItem>
              ))
          }
        </div>
        <div
          className="w-100% flex ai-c"
          style={{
            justifyContent: shouldNarrow ? 'center' : 'flex-end',
            height: shouldNarrow ? '150px' : '100px',
          }}
        >
          <Button onClick={handleJump} className="fs-12 flex ai-c jc-b p-9px gap-5px text-base btn-base">
            <div className="i-ant-design:plus-circle-outlined"></div>
            {
              !shouldNarrow && <span>新建聊天</span>
            }
          </Button>
        </div>
        <div
          className="bg-transparent cursor-ew-resize w-14px absolute top-0 right-0 h-100% flex jc-c ai-c group"
          onPointerDown={e => onDragStart(e as any)}
        >
          <div className="i-radix-icons:drag-handle-dots-2 ml-[-2px] opacity-0 sub-text-base group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

    </div>
  )
}

export default SideBar

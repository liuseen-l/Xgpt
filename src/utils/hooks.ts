import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

export function useToggle() {
  const root = document.querySelector('#root')
  const classList = Array.from(root?.classList || [])
  if (classList.includes('dark'))
    root?.classList.remove('dark')

  else
    root?.classList.add('dark')
}

export function useScrollToBottom(
  scrollRef: RefObject<HTMLDivElement>,
  detach: boolean = false,
) {
  const [autoScroll, setAutoScroll] = useState(true)
  function scrollDomToBottom() {
    const dom = scrollRef.current
    if (dom) {
      requestAnimationFrame(() => {
        setAutoScroll(true)
        dom.scrollTo({
          top: dom.scrollHeight,
          behavior: 'smooth',
        })
      })
    }
  }

  // auto scroll
  useEffect(() => {
    if (autoScroll && !detach)
      scrollDomToBottom()
  })

  return {
    scrollRef,
    autoScroll,
    setAutoScroll,
    scrollDomToBottom,
  }
}

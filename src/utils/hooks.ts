import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { RefObject } from 'react'
import { createContext, useEffect, useRef, useState } from 'react'
import { message } from 'antd'
import request from './request'
/**
 * 控制主题
 */
export const ThemeInitContext = createContext<{
  handleToggle: () => void
  isDark: boolean
}>({} as any)

export function useTheme() {
  const [isDark, setDark] = useState(false)

  const handleToggle = () => {
    const root = document.querySelector('#root')
    const classList = Array.from(root?.classList || [])
    if (classList.includes('dark')) {
      setDark(false)
      root?.classList.remove('dark')
    }
    else {
      setDark(true)
      root?.classList.add('dark')
    }
  }

  return {
    handleToggle,
    isDark,
  }
}

/**
 * 控制滚动
 * @param scrollRef
 * @param detach
 * @returns
 */
export function useScrollToBottom(
  scrollRef: RefObject<HTMLDivElement>,
) {
  function scrollDomToBottom() {
    const dom = scrollRef.current
    if (dom) {
      requestAnimationFrame(() => {
        dom.scrollTo({
          top: dom.scrollHeight,
          behavior: 'smooth',
        })
      })
    }
  }

  function scrollDomToTop() {
    const dom = scrollRef.current
    if (dom) {
      requestAnimationFrame(() => {
        dom.scrollTo({
          top: dom.scrollHeight,
          behavior: 'smooth',
        })
      })
    }
  }

  return {
    scrollRef,
    scrollDomToTop,
    scrollDomToBottom,
  }
}

/**
 * 请求通用函数
 * @param config
 * @returns
 */
export function useFetch<T = any, D = any>(config: AxiosRequestConfig<D>) {
  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState(null)

  const fetch = async (config: AxiosRequestConfig<D>) => {
    setLoading(true)
    try {
      const res = (await request.request<T, D>(config)) as AxiosResponse<T>
      setData(res?.data)
    }
    catch (err) {
      setError(err as any)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch(config)
  }, [])

  return {
    isLoading,
    data,
    error,
  }
}

/**
 * get请求函数
 * @param url
 * @param params
 * @returns
 */
export function useGetFecth<T = any>(url: string, params: any) {
  const config = {
    url,
    method: 'get',
    params,
  }
  return useFetch<T>(config)
}

/**
 * post请求函数
 * @param data
 * @returns
 */
export function usePostFecth<T = any, D = any>(data: D) {
  const config: AxiosRequestConfig<D> = {
    method: 'post',
    data,
  }
  return useFetch<T, D>(config)
}

export function useCount() {
  // 用普通变量也可以，只不过每次countSaver渲染都会变成10，但是页面还是会倒计时，因为定时器由于作用域关系始终用的第一次渲染时声明的变量
  // useState也会有同样的问题，useState返回的值也属于普通变量，因此定时器也始终访问的是第一次渲染时useState返回的变量
  const countSaver = useRef(10)
  const isPlaying = useRef(false)
  const [btnCount, setBtnCount] = useState(10)

  const play = () => {
    isPlaying.current = true
    const timer = setInterval(() => {
      if (countSaver.current === 1) {
        setBtnCount(10)
        countSaver.current = 10
        clearInterval(timer)
        isPlaying.current = false
        return
      }
      countSaver.current = countSaver.current - 1
      setBtnCount(countSaver.current) // 触发下一次渲染
    }, 1000)
  }

  return {
    btnCount,
    play,
    isPlaying,
  }
}

/**
 * message提示
 */

export function useMessage() {
  const success = (content?: string) => {
    message?.open({
      type: 'success',
      content: `${content || 'This is a success message'}`,
    })
  }

  const error = (content?: string) => {
    message?.open({
      type: 'error',
      content: `${content || '请求错误'}`,
    })
  }

  return {
    success,
    error,
  }
}

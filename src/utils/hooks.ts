import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import type { RefObject } from 'react'
import { useEffect, useState } from 'react'
import request from './request'

/**
 * 控制主题
 */
export function useToggle() {
  const root = document.querySelector('#root')
  const classList = Array.from(root?.classList || [])
  if (classList.includes('dark'))
    root?.classList.remove('dark')
  else
    root?.classList.add('dark')
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

  return {
    scrollRef,
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

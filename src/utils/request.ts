// export const request = axios.create({
//   baseURL: import.meta.env.Elven_RequestBaseUrl || 'http://localhost:5173',
//   withCredentials: false, // 跨域请求时是否需要使用凭证
//   timeout: 30000,
// })

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from 'axios'
import axios from 'axios'
import { useEffect, useState } from 'react'

export type Response<T> = Promise<T | AxiosResponse<T>>

export class Request {
  constructor(config?: CreateAxiosDefaults) {
    this.axiosInstance = axios.create(config)

    this.axiosInstance.interceptors.request.use(
      (axiosConfig: InternalAxiosRequestConfig) =>
        this.requestInterceptor(axiosConfig),
    )
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<unknown, unknown>) =>
        this.responseSuccessInterceptor(response),
      (error: any) => this.responseErrorInterceptor(error),
    )
  }

  private axiosInstance: AxiosInstance

  private async requestInterceptor(
    axiosConfig: InternalAxiosRequestConfig,
  ): Promise<any> {
    // const { token } = useGlobalStore.getState()

    // if (token)
    //   axiosConfig.headers.Authorization = `Bearer ${token}`

    return Promise.resolve(axiosConfig)
  }

  private async responseSuccessInterceptor(
    response: AxiosResponse<any, any>,
  ): Promise<any> {
    return Promise.resolve([false, response.data, response])
  }

  private async responseErrorInterceptor(error: any): Promise<any> {
    return Promise.resolve([true, error?.response?.data])
  }

  request<T, D = any>(config: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance(config)
  }

  get<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance.get(url, config)
  }

  post<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Response<T> {
    return this.axiosInstance.post(url, data, config)
  }

  put<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Response<T> {
    return this.axiosInstance.put(url, data, config)
  }

  delete<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Response<T> {
    return this.axiosInstance.delete(url, config)
  }
}

const request = new Request({ timeout: 60 * 1000 * 5 })

export function useFetch<T = any>(config: AxiosRequestConfig<T>) {
  const [isLoading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const fetch = async (config: AxiosRequestConfig<T>) => {
    setLoading(true)
    try {
      const data = await request.request<any>(config)
      setData(data)
    }
    catch (err) {
      setError(err as any)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetch(config)
  }, [config])

  return {
    isLoading,
    data,
    error,
  }
}

export interface FecthSSEOptions {
  onOpen: (...argus: any[]) => any
  onMessage: (...argus: any[]) => any
  onClose: (...argus: any[]) => any
}

export async function fetchSSE(options = {}) {
  const { onOpen, onMessage, onClose } = options as FecthSSEOptions

  const res = await fetch('http://124.71.110.30:8080/chat/xf/question', {
    method: 'POST',
    headers: {
      'accept': 'text/event-stream',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userCode: '123',
      chatCode: 'chat_3',
      content: '中国的直辖市有哪些？',
    }),
  })

  if (res.status !== 200)
    return
  onOpen && onOpen()

  const reader = res.body?.getReader()

  const read = (): Promise<any> | undefined => {
    // value 为返回数据，Uint8Array
    return reader?.read().then(({ done, value }) => {
      if (done) {
        onClose && onClose()
        return
      }
      onMessage && onMessage(new TextDecoder().decode(value))
      return read()
    })
  }
  return read()
}

export default request

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
import { useGlobalStore } from '~/stores/global'

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
    const { token } = useGlobalStore.getState()

    if (token)
      axiosConfig.headers.token = `${token}`

    return Promise.resolve(axiosConfig)
  }

  private async responseSuccessInterceptor(
    response: AxiosResponse<any, any>,
  ): Promise<any> {
    return Promise.resolve(response)
  }

  private async responseErrorInterceptor(error: any): Promise<any> {
    return Promise.resolve(error?.response)
  }

  request<T, D = any>(config: AxiosRequestConfig<D>): Promise<AxiosResponse<T>> {
    return this.axiosInstance(config)
  }

  get<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get(url, config)
  }

  post<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post(url, data, config)
  }

  put<T, D = any>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig<D>,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put(url, data, config)
  }

  delete<T, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete(url, config)
  }
}

const request = new Request({ timeout: 60 * 1000 * 5, baseURL: 'http://124.71.110.30:8080' })

export default request

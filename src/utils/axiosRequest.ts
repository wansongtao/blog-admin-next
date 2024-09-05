import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig
} from 'axios'
import { useUserStore } from '@/stores/user'
import createAxiosRetryRequestPlugin from '@/plugins/retryRequest'

import type { IBaseResponse, IConfigHeader } from '@/types/api'

const addToken = (config: InternalAxiosRequestConfig & IConfigHeader) => {
  if (config.headers?.isToken === false) {
    return config
  }

  const store = useUserStore()
  const token = store.accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

const processResponse = (res: AxiosResponse<IBaseResponse | Blob>) => {
  const data = res.data
  if (data instanceof Blob || data.statusCode === 200) {
    return res
  }

  window.$message.error(data.message)
  return Promise.reject(new AxiosError(data.message))
}

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  withCredentials: true
})

const retryRequest = createAxiosRetryRequestPlugin({
  maxRetryCount: 2,
  request: instance.request,
  isRetry: (err) => {
    if (err?.response?.status !== 401 && err?.response?.status !== 403) {
      return true
    }

    return false
  }
})
instance.interceptors.response.use(undefined, retryRequest.responseInterceptorRejected)

instance.interceptors.request.use(addToken, (error: AxiosError) => Promise.reject(error))
instance.interceptors.response.use(processResponse, (error: AxiosError) => {
  if (error.code === 'ERR_CANCELED') {
    return Promise.reject(error)
  }

  window.$message.error(error.response?.statusText || error.message)
  return Promise.reject(error)
})

const request = <T = unknown, U = IBaseResponse<T>, C = unknown>(
  config: AxiosRequestConfig<C> & IConfigHeader
) => {
  return new Promise<[err?: AxiosError, data?: U]>((resolve) => {
    instance
      .request<U>(config)
      .then((res) => {
        resolve([undefined, res.data])
      })
      .catch((error: AxiosError) => {
        resolve([error])
      })
  })
}

export default request

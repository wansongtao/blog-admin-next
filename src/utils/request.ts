import axios, { type AxiosError, type AxiosResponse, type AxiosRequestConfig } from 'axios'
import type { IBaseResponse } from '@/types/index'
import { message } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'
import { getDataType, throttle } from '@/utils/index'

const historyRequestMap: Record<string, number> = {}
/**
 * Async clear expired request information every 5 seconds.
 */
const clearHistoryReqMap = throttle((expiredTime: number) => {
  setTimeout(() => {
    const keys = Object.keys(historyRequestMap)
    if (!keys.length) {
      return
    }

    for (const key in keys) {
      if (historyRequestMap[key] < expiredTime) {
        delete historyRequestMap[key]
      }
    }
  }, 0)
}, 5000)
const isDuplicateRequest = (config: AxiosRequestConfig, interval = 400) => {
  const { method, url, data, params } = config
  let key = `${method}-${url}`

  try {
    if (data && getDataType(data) === 'object') {
      key += `-${JSON.stringify(data)}`
    }
    if (params && getDataType(params) === 'object') {
      key += `-${JSON.stringify(params)}`
    }

    const timestamp = Date.now()
    if (historyRequestMap[key] && timestamp - historyRequestMap[key] < interval) {
      return true
    }

    historyRequestMap[key] = timestamp
    clearHistoryReqMap(timestamp - interval)
    return false
  } catch (e) {
    return false
  }
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json;'
  }
})

instance.interceptors.request.use(
  (config) => {
    if (config.headers?.isToken !== false) {
      const store = useUserStore()
      const token = store.getToken()

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    if (!config.headers?.allowDuplication && isDuplicateRequest(config)) {
      return Promise.reject(new Error('Duplicate requests!'))
    }

    return config
  },
  (error: AxiosError) => {
    console.error(error, 'req')

    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (res: AxiosResponse<IBaseResponse | Blob, any>): any => {
    const data = res.data

    if (data instanceof Blob) {
      return data
    }

    if (data.code !== 200) {
      message.error(data.msg)
      return Promise.reject(data)
    }

    return data
  },
  (error: AxiosError) => {
    // 处理取消请求错误
    if (error.code === 'ERR_CANCELED') {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      return Promise.reject(error)
    }

    // 超出 2xx 范围的http状态码都会触发该函数。包括网络错误和超时
    message.error(error.response?.statusText || error.message)
    return Promise.reject(error)
  }
)

export default instance

import request from '@/utils/axiosRequest'

import type { ILoginParams } from '@/types/api/common'

export const getCaptcha = () => {
  return request<{ captcha: string }>({
    url: '/auth/captcha',
    method: 'GET',
    headers: {
      isToken: false
    }
  })
}

export const setLogin = (data: ILoginParams) => {
  return request<{ token: string; refreshToken: string }>({
    url: '/auth/login',
    method: 'POST',
    headers: {
      isToken: false
    },
    data
  })
}

export const setLogout = () => {
  return request({
    url: '/auth/logout',
    method: 'get'
  })
}

export const getNewToken = (refreshToken: string) => {
  return request<{ token: string; refreshToken: string }>({
    url: '/auth/refresh-token',
    method: 'get',
    params: {
      refreshToken
    }
  })
}

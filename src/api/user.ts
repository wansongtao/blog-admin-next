import request from '@/utils/axiosRequest'

import type { IBaseList, IQuery } from '@/types/api'
import type {
  IPasswordParam,
  IProfile,
  IProfileParam,
  IUserDetail,
  IUserListItem,
  IUserParam
} from '@/types/api/user'

export const getProfile = () => {
  return request<IProfile>({
    url: '/user/profile',
    method: 'get'
  })
}

export const updateProfile = (data: IProfileParam) => {
  return request({
    url: '/user/profile',
    method: 'patch',
    data
  })
}

export const updatePassword = (data: IPasswordParam) => {
  return request({
    url: '/user/password',
    method: 'patch',
    data
  })
}

export const getUserList = (params: IQuery) => {
  return request<IBaseList<IUserListItem>>({
    url: '/users',
    method: 'get',
    params
  })
}

export const addUser = (data: IUserParam) => {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export const deleteUser = (id: string) => {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  })
}

export const deleteUsers = (ids: string[]) => {
  return request({
    url: '/users/batch-delete',
    method: 'post',
    data: {
      ids
    }
  })
}

export const updateUser = (id: string, data: IUserParam) => {
  return request({
    url: `/users/${id}`,
    method: 'patch',
    data
  })
}

export const getUserDetail = (id: string) => {
  return request<IUserDetail>({
    url: `/users/${id}`,
    method: 'get'
  })
}

export const resetUserPassword = (id: string) => {
  return request({
    url: `/users/reset-password`,
    method: 'post',
    data: {
      id
    }
  })
}

import request from '@/utils/axiosRequest'

import type { IMenuListItem, IMenuParam, IMenuQuery, IMenuTree } from '@/types/api/menu'
import type { IBaseList } from '@/types/api'

export const getMenuList = (params: IMenuQuery) => {
  return request<IBaseList<IMenuListItem>>({
    url: '/permission',
    method: 'GET',
    params
  })
}

export const getMenuTree = (containButton: boolean = false) => {
  return request<IMenuTree[]>({
    url: '/permission/tree',
    method: 'GET',
    params: {
      containButton
    }
  })
}

export const getMenuDetail = (id: number) => {
  return request<IMenuParam>({
    url: `/permission/${id}`,
    method: 'get'
  })
}

export const deleteMenu = (id: number) => {
  return request({
    url: `/permission/${id}/delete`,
    method: 'patch'
  })
}

export const deleteMenuList = (ids: number[]) => {
  return request({
    url: '/permission/batch/delete',
    method: 'patch',
    data: {
      ids
    }
  })
}

export const addMenu = (data: IMenuParam) => {
  return request({
    url: '/permission',
    method: 'post',
    data
  })
}

export const updateMenu = (id: number, data: IMenuParam) => {
  return request({
    url: `/permission/${id}`,
    method: 'patch',
    data
  })
}

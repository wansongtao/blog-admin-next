import request from '@/utils/axiosRequest'

import type { IMenuListItem, IMenuQuery } from '@/types/api/menu'
import type { IBaseList } from '@/types/api'

export const getMenuList = (params: IMenuQuery) => {
  return request<IBaseList<IMenuListItem>>({
    url: '/permissions',
    method: 'GET',
    params
  })
}

export const deleteMenu = (id: number) => {
  return request({
    url: `/permissions/${id}`,
    method: 'delete'
  })
}

export const deleteMenuList = (ids: number[]) => {
  return request({
    url: '/permissions/batch-delete',
    method: 'post',
    data: {
      ids
    }
  })
}

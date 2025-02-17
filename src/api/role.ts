import request from '@/utils/axiosRequest'

import type { IBaseList, IQuery } from '@/types/api'
import type { IRoleDetail, IRoleListItem, IRoleParam, IRoleTreeItem } from '@/types/api/role'

export const getRoleList = (params: IQuery) => {
  return request<IBaseList<IRoleListItem>>({
    url: '/role',
    method: 'GET',
    params
  })
}

export const addRole = (data: IRoleParam) => {
  return request({
    url: '/role',
    method: 'post',
    data
  })
}

export const deleteRole = (id: number) => {
  return request({
    url: `/role/${id}/delete`,
    method: 'patch'
  })
}

export const updateRole = (id: number, data: IRoleParam) => {
  return request({
    url: `/role/${id}`,
    method: 'patch',
    data
  })
}

export const getRoleDetail = (id: number) => {
  return request<IRoleDetail>({
    url: `/role/${id}`,
    method: 'get'
  })
}

export const getRoleTree = () => {
  return request<IRoleTreeItem[]>({
    url: '/role/tree',
    method: 'get'
  })
}

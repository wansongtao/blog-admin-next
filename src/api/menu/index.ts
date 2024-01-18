import instance from '@/utils/request'
import type { IBaseResponse, IBaseList } from '@/types/index'
import type { IQueryMenuParams, IMenuTreeItem } from '@/types/menu/index'

export const getMenuTypes = () => {
  return instance.request<any, IBaseResponse<{ id: number; name: string }[]>>({
    url: '/admin/menu/type',
    method: 'GET'
  })
}

export const getMenuTree = (params: IQueryMenuParams) => {
  return instance.request<any, IBaseResponse<IBaseList<IMenuTreeItem>>>({
    url: '/admin/menu',
    method: 'GET',
    params
  })
}

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

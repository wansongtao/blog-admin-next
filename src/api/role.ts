import request from '@/utils/axiosRequest'

import type { IBaseList, IQuery } from '@/types/api'
import type { IRoleListItem } from '@/types/api/role'

export const getRoleList = (params: IQuery) => {
  return request<IBaseList<IRoleListItem>>({
    url: '/roles',
    method: 'GET',
    params
  })
}

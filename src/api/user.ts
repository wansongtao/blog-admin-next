import request from '@/utils/axiosRequest'

import type { IBaseList, IQuery } from '@/types/api'
import type { IUserListItem } from '@/types/api/user'

export const getUserList = (params: IQuery) => {
  return request<IBaseList<IUserListItem>>({
    url: '/users',
    method: 'get',
    params
  })
}

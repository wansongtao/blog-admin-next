import request from '@/utils/axiosRequest'

import type { IBaseList, IQuery } from '@/types/api'
import type { ICategoryEntity } from '@/types/api/category'

export const getCategoryList = (params: IQuery) => {
  return request<IBaseList<ICategoryEntity>>({
    url: '/category',
    method: 'get',
    params
  })
}

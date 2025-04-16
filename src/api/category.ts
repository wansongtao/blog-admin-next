import request from '@/utils/axiosRequest'

import type { IBaseList, IBaseResponse, IQuery } from '@/types/api'
import type { ICategoryEntity, ICategoryTreeEntity, ICategoryParams } from '@/types/api/category'

export const getCategoryList = (params: IQuery) => {
  return request<IBaseList<ICategoryEntity>>({
    url: '/category',
    method: 'get',
    params
  })
}

export const getCategoryTree = () => {
  return request<ICategoryTreeEntity[]>({
    url: '/category/tree',
    method: 'get'
  })
}

export const addCategory = (data: ICategoryParams) => {
  return request<IBaseResponse>({
    url: '/category',
    method: 'post',
    data
  })
}

import request from '@/utils/axiosRequest'

import type { IBaseList, IBaseResponse, IQuery } from '@/types/api'
import type {
  ICategoryEntity,
  ICategoryTreeEntity,
  ICategoryParams,
  ICategoryDetailEntity
} from '@/types/api/category'

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

export const getCategoryDetail = (id: number) => {
  return request<ICategoryDetailEntity>({
    url: `/category/${id}`,
    method: 'get'
  })
}

export const updateCategory = (id: number, data: ICategoryParams) => {
  return request({
    url: `/category/${id}`,
    method: 'patch',
    data
  })
}

export const removeCategory = (id: number) => {
  return request({
    url: `/category/${id}/delete`,
    method: 'patch'
  })
}

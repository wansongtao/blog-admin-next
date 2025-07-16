import request from '@/utils/axiosRequest'

import type {
  IArticleDetail,
  IArticleListItem,
  IArticleQuery,
  IArticleVisibilityListItem,
  ICreateArticleDto
} from '@/types/api/article'
import type { IBaseList, IBaseResponse } from '@/types/api'

export const getArticleVisibilityList = () => {
  return request<IArticleVisibilityListItem[]>({
    url: '/article/visibility',
    method: 'get'
  })
}

export const addArticle = (data: ICreateArticleDto) => {
  return request<IBaseResponse>({
    url: '/article',
    method: 'post',
    data
  })
}

export const getArticleList = (params: IArticleQuery) => {
  return request<IBaseList<IArticleListItem>>({
    url: '/article',
    method: 'get',
    params
  })
}

export const getArticleDetail = (id: number) => {
  return request<IArticleDetail>({
    url: `/article/${id}`,
    method: 'get'
  })
}

export const updateArticle = (id: number, data: Partial<ICreateArticleDto>) => {
  return request<IBaseResponse>({
    url: `/article/${id}`,
    method: 'patch',
    data
  })
}

export const deleteArticle = (id: number) => {
  return request<IBaseResponse>({
    url: `/article/${id}/delete`,
    method: 'patch'
  })
}

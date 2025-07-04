import request from '@/utils/axiosRequest'

import type {
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
    method: 'GET',
    params
  })
}

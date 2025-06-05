import request from '@/utils/axiosRequest'

import type { IArticleVisibilityListItem, ICreateArticleDto } from '@/types/api/article'
import type { IBaseResponse } from '@/types/api'

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

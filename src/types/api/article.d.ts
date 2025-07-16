import type { IQuery } from '.'

export type IArticleVisibility = 'PRIVATE' | 'INTERNAL' | 'PUBLIC'

export interface IArticleVisibilityListItem {
  label: string
  value: IArticleVisibility
}

export interface ICreateArticleDto {
  title: string
  categoryId: number
  visibility: IArticleVisibility
  content: string
  coverImage?: string
  summary?: string
  theme?: string
  published?: boolean
  featured?: boolean
}

export interface IArticleQuery extends IQuery {
  categoryId?: number | null
  visibility?: IArticleVisibility | null
  published?: 0 | 1 | null
  featured?: 0 | 1 | null
}

export interface IArticleListItem {
  id: number
  title: string
  visibility: IArticleVisibility
  categoryName: string
  coverImage?: string
  summary?: string
  theme?: string
  published: boolean
  featured: boolean
  author: string
  /**
   * 更新时间
   */
  updatedAt: string
  /**
   * 发布时间
   */
  publishedAt?: string
}

export interface IArticleDetail {
  id: number
  title: string
  content: string
  visibility: IArticleVisibility
  coverImage?: string
  summary?: string
  theme?: string
  published: boolean
  featured: boolean
  categoryId: number
  categoryName: string
  author: string
  viewCount: number
  commentCount: number
  likeCount: number
  /**
   * 更新时间
   */
  updatedAt: string
  /**
   * 发布时间
   */
  publishedAt?: string
}

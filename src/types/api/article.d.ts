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

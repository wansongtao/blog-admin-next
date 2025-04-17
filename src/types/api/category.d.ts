export interface ICategoryEntity {
  id: number
  pid?: number
  name: string
  description?: string
  sort: number
  hidden: boolean
  createdAt: string
  updatedAt: string
  children?: ICategoryEntity[]
}

export interface ICategoryParams {
  /**
   * 名称，1-50个字符。
   */
  name?: string
  pid?: number | null
  /**
   * 是否隐藏该分类（仅后台可以使用该分类）
   */
  hidden?: boolean
  sort?: number
  description?: string
}

export interface ICategoryTreeEntity {
  id: number
  pid?: number
  name: string
  children?: ICategoryTreeEntity[]
}

export interface ICategoryDetailEntity {
  pid?: number
  name: string
  description?: string
  sort: number
  hidden: boolean
}

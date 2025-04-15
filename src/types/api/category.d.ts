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

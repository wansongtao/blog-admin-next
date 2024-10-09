export interface IRoleListItem {
  id: number
  name: string
  description?: string
  disabled: boolean
  createdAt: string
  updatedAt: string
}

export interface IRoleParam {
  description?: string
  disabled?: boolean
  permissions?: number[]
  name?: string
}

import { IGender } from '@/types'

export interface IProfileParam {
  avatar?: string
  birthday?: string | null
  description?: string | null
  email?: string | null
  nickName?: string | null
  phone?: string | null
  gender?: IGender
}

export interface IProfile extends IProfileParam {
  roles: string[]
  userName: string
}

export interface IPasswordParam {
  oldPassword: string
  newPassword: string
}

export interface IUserListItem {
  avatar?: string
  disabled: boolean
  id: string
  nickName?: string
  userName: string
  createdAt: string
  updatedAt: string
  roleNames?: string[]
}

export interface IUserParam {
  userName?: string
  disabled?: boolean
  nickName?: string
  roles?: number[]
}

export interface IUserDetail {
  disabled: boolean
  id: number
  nickName?: string
  roles?: number[]
  userName: string
}

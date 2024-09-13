import type { IMenuType } from '@/types'

export const MENU_TYPES: { [key in IMenuType]: string } = {
  DIRECTORY: '目录',
  MENU: '菜单',
  BUTTON: '按钮'
}

export const STATUS: {
  readonly label: string
  readonly value: 0 | 1
}[] = [
  {
    label: '启用',
    value: 0
  },
  {
    label: '禁用',
    value: 1
  }
]

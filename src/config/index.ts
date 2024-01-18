import type { ITheme } from '@/types/index'
import type { IQueryMenuParams } from '@/types/menu/index'

export const defaultTheme: ITheme = 'light'

export const MENU_STATUS: { label: string; value: IQueryMenuParams['disabled'] }[] = [
  {
    label: '启用',
    value: 1
  },
  {
    label: '禁用',
    value: 0
  }
]

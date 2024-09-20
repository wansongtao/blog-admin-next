import type { IQuery } from '.'
import type { IMenuType } from '..'

export interface IMenuQuery extends IQuery {
  type?: IMenuType | null
}

export interface IMenuListItem {
  /**
   * 菜单ID
   */
  id: number
  /**
   * 菜单路径
   */
  path?: string
  /**
   * 父菜单id
   */
  pid?: number
  /**
   * 菜单名称
   */
  name: string
  /**
   * 菜单类型
   */
  type: IMenuType
  /**
   * 权限字符串
   */
  permission?: string
  /**
   * 菜单icon名
   */
  icon?: string
  /**
   * 是否禁用
   */
  disabled: boolean
  /**
   * 排序, 越大越靠前
   */
  sort: number
  /**
   * 添加时间
   */
  createdAt: string
  children?: IMenuTreeItem[]
}

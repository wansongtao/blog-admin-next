import MENU_ICON_MAP from '@/plugins/menuIcons'

import type { MenuOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'

const getFullPath = (path: string, parentPath = '/') => {
  if (parentPath[parentPath.length - 1] !== '/' && path.indexOf('/') !== 0) {
    return parentPath + '/' + path
  }

  if (path.indexOf(parentPath) === 0) {
    return path
  }

  return parentPath + path
}

export const generateMenus = (
  routes: RouteRecordRaw[],
  parentPath = '',
  isSkip = (route: RouteRecordRaw) => route.meta?.hidden
) => {
  const menus: MenuOption[] = []

  routes.forEach((item) => {
    if (isSkip(item)) {
      return
    }

    const { meta, name } = item
    const path = getFullPath(item.path, parentPath)
    const menuItem: MenuOption = {
      key: path,
      label: meta?.title || (name as string)
    }

    if (meta?.icon && MENU_ICON_MAP[meta.icon]) {
      menuItem.icon = () => h(MENU_ICON_MAP[meta.icon!])
    }
    if (item.children?.length) {
      menuItem.children = generateMenus(item.children, path, isSkip)
    }

    menus.push(menuItem)
  })

  return menus
}

export const generateCacheRoutes = (
  routes: RouteRecordRaw[],
  isSkip = (route: RouteRecordRaw) => route.meta?.cache !== true || !route.name
) => {
  const cacheRouteNames: string[] = []

  routes.forEach((route) => {
    if (!isSkip(route)) {
      cacheRouteNames.push(route.name as string)
    }

    if (route.children?.length) {
      cacheRouteNames.push(...generateCacheRoutes(route.children, isSkip))
    }
  })

  return cacheRouteNames
}

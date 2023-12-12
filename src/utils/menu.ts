import ParentView from '@/components/ParentView/ParentView.vue'
import { h } from 'vue'
import MENU_ICON_MAP from '@/config/menuIcon'
import type { IMenuData } from '@/types/common/index'
import type { RouteRecordRaw } from 'vue-router'
import type { IMenuItem } from '@/types/index'

const componentMap = import.meta.glob('@/views/**/*.vue')
for (const path in componentMap) {
  const name = path.replace('/src/views', '')
  componentMap[name] = componentMap[path]
  delete componentMap[path]

  if (path.indexOf('/components/') !== -1) {
    delete componentMap[path]
  }
}

export const generateAsideMenu = (routes: RouteRecordRaw[], parentPath = ''): IMenuItem[] => {
  const menus: IMenuItem[] = []

  routes.forEach((item) => {
    if (item.meta?.hidden) {
      return
    }

    const { meta, name } = item
    let path = parentPath
    if (item.path) {
      if (path[path.length - 1] !== '/' && item.path.indexOf('/') !== 0) {
        path += '/' + item.path
      } else {
        path += item.path
      }
    }

    const menuItem: IMenuItem = {
      key: name as string,
      label: meta?.title || (name as string),
      path
    }

    if (meta?.icon && MENU_ICON_MAP[meta.icon]) {
      menuItem.icon = () => h(MENU_ICON_MAP[meta.icon!])
    }

    if (item.children?.length) {
      menuItem.children = generateAsideMenu(item.children, path)
    }

    menus.push(menuItem)
  })

  return menus
}

export const generateRoutes = (
  menuTree: IMenuData[]
): {
  routes: RouteRecordRaw[]
  cacheRouteNames: string[]
} => {
  const menuList = menuTree.map((item) => {
    return {
      ...item,
      path: item.path.indexOf('/') !== 0 ? `/${item.path}` : item.path
    }
  })

  const cacheRouteNames: string[] = []
  const recursionGenerateRoutes = (tree: IMenuData[]): RouteRecordRaw[] => {
    return tree.map((item) => {
      const route: RouteRecordRaw = {
        path: item.path,
        component: ParentView,
        meta: {}
      }

      if (item.component && componentMap[item.component]) {
        route.component = componentMap[item.component]
        delete componentMap[item.component]
      }

      if (item.name) {
        route.name = item.name
      }
      if (item.title) {
        route.meta!.title = item.title
      }
      if (item.icon) {
        route.meta!.icon = item.icon
      }
      if (item.isCache) {
        route.meta!.isCache = item.isCache
        cacheRouteNames.push(item.name!)
      }
      if (item.hidden) {
        route.meta!.hidden = item.hidden
      }

      if (item.children?.length) {
        // @ts-ignore
        route.children = recursionGenerateRoutes(item.children)
      }

      return route
    })
  }

  const routes = recursionGenerateRoutes(menuList)
  return {
    routes,
    cacheRouteNames: cacheRouteNames.filter((item) => !!item)
  }
}

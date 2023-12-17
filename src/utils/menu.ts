import ParentView from '@/components/ParentView/ParentView.vue'

import { h } from 'vue'
import MENU_ICON_MAP from '@/config/menuIcon'
import COMPONENT_MAP from '@/config/routeComponent'
import { adminRoute } from '@/router/index'
import { parse } from 'web-storage-plus'

import type { IMenuData } from '@/types/common/index'
import type { RouteRecordRaw } from 'vue-router'
import type { IMenuItem } from '@/types/index'

const getFullPath = (path: string, parentPath = '/') => {
  if (parentPath[parentPath.length - 1] !== '/' && path.indexOf('/') !== 0) {
    return parentPath + '/' + path
  }

  if (path.indexOf(parentPath) === 0) {
    return path
  }

  return parentPath + path
}

const getProps = (props: IMenuData['props']) => {
  if (typeof props === 'boolean') {
    return props
  }

  try {
    return parse(JSON.stringify(props))
  } catch (e) {
    console.error(e)
    return false
  }
}

export const generateAsideMenu = (routes: RouteRecordRaw[], parentPath = ''): IMenuItem[] => {
  const menus: IMenuItem[] = []

  routes.forEach((item) => {
    if (item.meta?.hidden) {
      return
    }

    const { meta, name } = item
    const path = getFullPath(item.path, parentPath)

    const menuItem: IMenuItem = {
      key: path,
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

export const generateRoutes = (menuTree: IMenuData[]): RouteRecordRaw => {
  const recursionGenerateRoutes = (tree: IMenuData[], parentPath = ''): RouteRecordRaw[] => {
    return tree.map((item) => {
      const path = getFullPath(item.path, parentPath)

      const route: RouteRecordRaw = {
        path,
        component: ParentView,
        meta: {}
      }

      if (item.component && COMPONENT_MAP[item.component]) {
        route.component = COMPONENT_MAP[item.component]
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
      if (item.cache && item.name) {
        route.meta!.cache = item.cache
      }
      if (item.hidden) {
        route.meta!.hidden = item.hidden
      }

      if (item.props) {
        route.props = getProps(item.props)
      }

      if (item.children?.length) {
        // 实现路由跳转父级菜单时，重定向到相应子菜单
        const redirectRoute = {
          path: route.path,
          title: item.title,
          redirect: item.redirect,
          meta: {
            hidden: true
          }
        }
        if (!item.redirect) {
          redirectRoute.redirect = getFullPath(item.children[0].path, route.path)
        }

        // @ts-ignore
        route.children = [redirectRoute, ...recursionGenerateRoutes(item.children, route.path)]
      }

      return route
    })
  }

  const routes = recursionGenerateRoutes(menuTree)
  adminRoute.children.push(...(routes as any))

  return adminRoute
}

export const generateCacheRouteNames = (routes: RouteRecordRaw[]): string[] => {
  const cacheRouteNames: string[] = []

  routes.forEach((route) => {
    if (route.meta?.cache && route.name) {
      cacheRouteNames.push(route.name as string)
    }

    if (route.children?.length) {
      cacheRouteNames.push(...generateCacheRouteNames(route.children))
    }
  })

  return cacheRouteNames
}

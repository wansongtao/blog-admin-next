import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getTheme, setTheme } from '@/utils/theme'
import { getSystemTheme } from '@/utils/index'
import { getMenus } from '@/api/common/index'
import { generateRoutes, generateAsideMenu } from '@/utils/menu'
import type { IMenuItem } from '@/types/index'

export const useSettingStore = defineStore('setting', () => {
  const theme = ref(getTheme())

  function followSystemTheme() {
    theme.value = getSystemTheme((mode) => {
      theme.value = mode
      setTheme(mode)
    })
    setTheme(theme.value)
  }
  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    setTheme(theme.value)
  }

  const collapsed = ref(false)
  function toggleCollapsed() {
    collapsed.value = !collapsed.value
  }

  const cacheRoutes = ref<string[]>([])
  const menus = ref<IMenuItem[]>([])
  async function getRoutesAction() {
    const result = await getMenus().catch(() => ({ data: [] }))

    const { routes, cacheRouteNames } = generateRoutes(result.data)
    cacheRoutes.value = cacheRouteNames
    menus.value = generateAsideMenu(routes)

    return routes
  }

  return {
    theme,
    followSystemTheme,
    toggleTheme,
    collapsed,
    toggleCollapsed,
    cacheRoutes,
    menus,
    getRoutesAction
  }
})

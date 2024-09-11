import type { IMenubarItem } from '@/types'

export const useAppSetStore = defineStore(
  'appSet',
  () => {
    const collapsed = ref(false)
    function toggleCollapsed() {
      collapsed.value = !collapsed.value
    }

    const theme = ref<'light' | 'dark'>('light')
    function toggleTheme() {
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    const menubarItems = ref<IMenubarItem[]>([])

    return {
      collapsed,
      toggleCollapsed,
      theme,
      toggleTheme,
      menubarItems
    }
  },
  { persist: true }
)

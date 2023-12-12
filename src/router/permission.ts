import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './index'
import { useUserStore } from '@/stores/user'
import { useSettingStore } from '@/stores/setting'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to) => {
  NProgress.start()

  const useStore = useUserStore()
  const token = useStore.token || useStore.getToken()
  if (!token && to.name !== 'Login') {
    NProgress.done()
    return `/login?redirect=${to.path}`
  }

  if (token) {
    if (!useStore.userInfo.roles.length) {
      await useStore.getUserInfoAction()
    }

    const settingStore = useSettingStore()
    if (!settingStore.menus?.length) {
      const routes = await settingStore.getRoutesAction()

      if (routes?.length) {
        for (const route of routes) {
          router.addRoute('LayoutView', route)
        }

        NProgress.done()
        return to.fullPath
      }
    }

    if (to.name === 'Login') {
      NProgress.done()
      return (to.query?.redirect as string) || '/'
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './index'
import { useUserStore } from '@/stores/user'
import { useAppSetStore } from '@/stores/appSet'
import { generateCacheRoutes } from '@/utils/menu'
import getStaticAdminRoute from './adminRoute'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to) => {
  NProgress.start()

  const userStore = useUserStore()
  const appSetStore = useAppSetStore()

  const token = userStore.accessToken
  if (!token) {
    appSetStore.menubarItems = []
    appSetStore.cacheRoutes = []

    if (to.name !== 'Login') {
      NProgress.done()
      return `/login?redirect=${to.path}`
    }
  }

  if (token) {
    if (to.name === 'Login') {
      NProgress.done()
      return (to.query?.redirect as string) || '/'
    }

    if (appSetStore.cacheRoutes.length === 0) {
      const routes = getStaticAdminRoute()
      appSetStore.cacheRoutes = generateCacheRoutes(routes.children ?? [])
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})

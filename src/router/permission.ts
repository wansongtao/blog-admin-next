import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './index'
import { useUserStore } from '@/stores/user'

NProgress.configure({ showSpinner: false })

router.beforeEach((to) => {
  NProgress.start()

  const useStore = useUserStore()
  const token = useStore.token || useStore.getToken()
  if (!token && to.name !== 'Login') {
    NProgress.done()
    return `/login?redirect=${to.path}`
  }

  if (token) {
    if (!useStore.userInfo.roles.length) {
      useStore.getUserInfoAction()
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

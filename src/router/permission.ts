import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './index'
import { useUserStore } from '@/stores/user'

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to) => {
  NProgress.start()

  const userStore = useUserStore()
  const token = userStore.accessToken
  if (!token && to.name !== 'Login') {
    NProgress.done()
    return `/login?redirect=${to.path}`
  }

  if (token && to.name === 'Login') {
    NProgress.done()
    return (to.query?.redirect as string) || '/'
  }
})

router.afterEach(() => {
  NProgress.done()
})

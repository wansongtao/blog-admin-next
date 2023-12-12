import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import NotFound from '@/views/NotFound.vue'
import LayoutView from '@/layout/LayoutView.vue'

export const adminRoute = {
  path: '/',
  component: LayoutView,
  name: 'LayoutView',
  meta: {
    title: '首页'
  },
  children: [
    {
      path: 'profile',
      name: 'profileView',
      component: () => import('@/views/profile/index.vue'),
      meta: {
        title: '个人中心',
        hidden: true
      }
    }
  ]
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: {
        title: '登录',
        hidden: true
      }
    },
    adminRoute,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound,
      meta: {
        title: '404',
        hidden: true
      }
    }
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return {
        el: to.hash
      }
    }

    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

export default router

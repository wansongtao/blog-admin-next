import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import NotFound from '@/views/NotFound.vue'
import LayoutView from '@/layout/LayoutView.vue'

export const adminRoute = {
  path: '/',
  component: LayoutView,
  meta: {
    title: '首页'
  },
  children: [
    {
      path: '',
      name: 'home',
      component: () => import('@/views/home/HomeView.vue'),
      meta: {
        title: '首页',
        icon: 'PieChartOutlined'
      }
    },
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
      component: LoginView
    },
    adminRoute,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
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

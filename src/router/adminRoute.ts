import LayoutView from '@/layout/LayoutView.vue'
import TheParentView from '@/components/the-parent-view/TheParentView.vue'

import type { RouteRecordRaw } from 'vue-router'

export default function getStaticAdminRoute(): RouteRecordRaw {
  return {
    path: '/',
    component: LayoutView,
    name: 'LayoutView',
    meta: {
      title: '首页'
    },
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/HomeView.vue'),
        meta: {
          title: '首页',
          icon: 'home'
        }
      },
      {
        path: 'profile',
        name: 'ProfileView',
        component: () => import('@/views/profile/ProfileView.vue'),
        meta: {
          title: '个人中心',
          hidden: false,
          cache: true
        }
      },
      {
        path: 'system',
        component: TheParentView,
        meta: {
          title: '系统管理',
          icon: 'system'
        },
        children: [
          {
            path: 'user',
            name: 'UserView',
            component: () => import('@/views/system/user/UserView.vue'),
            meta: {
              title: '用户管理',
              icon: 'user'
            }
          },
          {
            path: 'role',
            name: 'RoleView',
            component: () => import('@/views/system/role/RoleView.vue'),
            meta: {
              title: '角色管理',
              icon: 'role'
            }
          },
          {
            path: 'menu',
            name: 'MenuView',
            component: () => import('@/views/system/menu/MenuView.vue'),
            meta: {
              title: '菜单管理',
              icon: 'menu'
            }
          }
        ]
      }
    ]
  }
}

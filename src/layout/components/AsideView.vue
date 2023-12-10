<script lang="ts" setup>
import { Menu as AMenu } from 'ant-design-vue'
import { reactive, watch, h, type VNode } from 'vue'
import { useSettingStore } from '@/stores/setting'
import { storeToRefs } from 'pinia'
import { adminRoute } from '@/router/index'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import { useRouter } from 'vue-router'
import MENU_ICON_MAP from '@/config/menuIcon'

interface MenuItem {
  key: string
  icon?: () => VNode
  label?: string
  path: string
  children?: MenuItem[]
}

const getMenus = (routers: RouteRecordRaw[], parentPath = '/'): MenuItem[] => {
  const menus: MenuItem[] = []

  routers.forEach((item) => {
    if (item.meta?.hidden) {
      return
    }

    const { meta, name } = item
    let path = parentPath
    if (item.redirect) {
      path = item.redirect as string
    } else if (item.path) {
      path = path[path.length - 1] !== '/' ? path + '/' + item.path : path + item.path
    }

    const menuItem: MenuItem = {
      key: name as string,
      label: meta?.title,
      path
    }

    if (meta?.icon && MENU_ICON_MAP[meta.icon]) {
      menuItem.icon = () => h(MENU_ICON_MAP[meta.icon!])
    }

    if (item.children && item.children.length > 0) {
      menuItem.children = getMenus(item.children, path)
    }

    menus.push(menuItem)
  })

  return menus
}

const setStore = useSettingStore()
const { collapsed } = storeToRefs(setStore)
const state = reactive<{ selectedKeys: string[]; openKeys: string[]; preOpenKeys: string[] }>({
  selectedKeys: [],
  openKeys: [],
  preOpenKeys: []
})

watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal
  }
)
watch(
  () => collapsed,
  (val) => {
    state.openKeys = val ? [] : state.preOpenKeys
  }
)

const items = reactive<MenuItem[]>(getMenus(adminRoute.children!, adminRoute.path))

const router = useRouter()
const onChangeRoute = ({ item }: MenuInfo) => {
  router.push(item.path)
}

watch(
  () => router.currentRoute.value.name,
  (val) => {
    if (state.selectedKeys.includes(val as string)) {
      return
    }

    router.currentRoute.value.matched.forEach((item) => {
      if (item.name && !item.meta?.hidden) {
        state.openKeys.push(item.name as string)
      }
    })

    state.selectedKeys = [val as string]
  },
  { immediate: true }
)

const version = __APP_VERSION__;
</script>

<template>
  <aside class="layout_aside" :class="collapsed ? 'w-80' : ''">
    <a-menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      mode="inline"
      :inline-collapsed="collapsed"
      :items="items"
      @click="onChangeRoute"
    ></a-menu>
    <div class="version">{{version}}</div>
  </aside>
</template>

<style lang="scss" scoped>
.layout_aside {
  overflow-y: auto;
  width: 220px;
  height: 100vh;
  border-right: 1px solid var(--st-c-divider);
  transition: width 0.5s cubic-bezier(0.2, 0, 0, 1) 0s;

  &::-webkit-scrollbar {
    display: none;
  }

  .version {
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 12px;
  }
}

.w-80 {
  width: 80px;

  .version {
    display: none;
  }
}

:deep(.ant-menu) {
  height: calc(100% - 32px);
  transition: var(--st-t-bg), width 0.5s cubic-bezier(0.2, 0, 0, 1) 0s;
}

:deep(.ant-menu-light.ant-menu-root.ant-menu-inline) {
  border-inline-end: none;
}

:deep(.ant-menu-light .ant-menu-item-selected) {
  background-color: var(--st-c-menu-checked);
}

:deep(.ant-menu-light:not(.ant-menu-horizontal) .ant-menu-item:not(.ant-menu-item-selected):hover) {
  background-color: var(--st-c-menu-active);
}

:deep(.ant-menu-light:not(.ant-menu-horizontal) .ant-menu-submenu-title:hover) {
  background-color: var(--st-c-menu-active);
  color: var(--st-c-text-1);
}

:deep(
    .ant-menu-light
      .ant-menu-item:hover:not(.ant-menu-item-selected):not(.ant-menu-submenu-selected),
    .ant-menu-light
      .ant-menu-submenu-title:hover:not(.ant-menu-item-selected):not(.ant-menu-submenu-selected)
  ) {
  color: none;
}

:deep(
    .ant-menu-light
      .ant-menu-item:hover:not(.ant-menu-item-selected):not(.ant-menu-submenu-selected),
    .ant-menu-light
      .ant-menu-submenu-title:hover:not(.ant-menu-item-selected):not(.ant-menu-submenu-selected)
  ) {
  color: var(--st-c-text-1);
}

:deep(.ant-menu-light.ant-menu-inline .ant-menu-sub.ant-menu-inline) {
  background: var(--st-c-menu-bg);
}

:deep(.ant-menu-light.ant-menu-root.ant-menu-vertical) {
  border-inline-end: none;
}
</style>

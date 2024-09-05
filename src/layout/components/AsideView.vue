<script lang="ts" setup>
import getStaticAdminRoute from '@/router/adminRoute'
import { generateMenus } from '@/utils/menu'

const menus = generateMenus(getStaticAdminRoute().children!)
const collapsed = ref(false)

const router = useRouter()
const onJumpPage = (path: string) => {
  router.push(path)
}
</script>

<template>
  <n-layout-sider
    bordered
    :native-scrollbar="false"
    collapse-mode="width"
    :collapsed-width="64"
    :width="240"
    :collapsed="collapsed"
  >
    <n-menu
      :collapsed="collapsed"
      :collapsed-width="64"
      :collapsed-icon-size="22"
      :options="menus"
      @update:value="onJumpPage"
    />
  </n-layout-sider>
</template>

<style lang="scss" scoped></style>

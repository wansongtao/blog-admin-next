<script lang="ts" setup>
import IconFold from '@/assets/svgs/fold.svg?component'
import IconUnfold from '@/assets/svgs/unfold.svg?component'
import { useAppSetStore } from '@/stores/appSet'

const appSetStore = useAppSetStore()
const { toggleCollapsed } = appSetStore
const { collapsed } = storeToRefs(appSetStore)
</script>

<template>
  <div class="btn-collapsed">
    <n-icon size="16" :component="collapsed ? IconUnfold : IconFold" @click="toggleCollapsed" />
  </div>
</template>

<style lang="scss" scoped>
.btn-collapsed {
  cursor: pointer;
}
</style>

<script lang="ts" setup>
import useMenuTree from '@/hooks/useMenuTree'

const { containButton = false } = defineProps<{
  containButton?: boolean
}>()

const menuId = defineModel<number>()
const { menuTree } = useMenuTree(containButton)
</script>

<template>
  <n-tree-select
    clearable
    key-field="id"
    label-field="name"
    :options="menuTree as any[]"
    v-model:value="menuId"
  />
</template>

<style lang="scss" scoped></style>

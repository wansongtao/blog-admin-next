<script lang="ts" generic="T extends number | null" setup>
import useCategoryTree from '@/hooks/useCategoryTree'

defineProps<{
  checkable?: boolean
  placeholder?: string
}>()

const id = defineModel<T>()
const { categoryTree } = useCategoryTree(true)
</script>

<template>
  <n-tree-select
    v-model:value="id"
    :options="categoryTree"
    :placeholder
    :checkable
    key-field="id"
    label-field="name"
    clearable
  />
</template>

<style lang="scss" scoped></style>

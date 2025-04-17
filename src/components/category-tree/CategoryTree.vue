<script lang="ts" generic="T extends number | null" setup>
import useCategoryTree from '@/hooks/useCategoryTree'
import { deepFindItem, deepMap } from '@/utils'

import type { ICategoryTreeEntity } from '@/types/api/category'

const { disabledName } = defineProps<{
  checkable?: boolean
  placeholder?: string
  disabledName?: string
}>()

const id = defineModel<T>()
const { categoryTree } = useCategoryTree(true)

const options = computed(() => {
  if (disabledName) {
    const list: (ICategoryTreeEntity & { disabled?: boolean })[] = [...categoryTree.value]
    const item = deepFindItem(list, (v) => v.name === disabledName)
    if (!item) {
      return categoryTree.value
    }

    item.disabled = true
    if (item.children?.length) {
      item.children = deepMap(item.children, (v) => {
        return {
          ...v,
          disabled: true
        }
      })
    }
    return list
  }

  return categoryTree.value
})
</script>

<template>
  <n-tree-select
    v-model:value="id"
    :options
    :placeholder
    :checkable
    key-field="id"
    label-field="name"
    clearable
  />
</template>

<style lang="scss" scoped></style>

<script lang="ts" generic="T extends number | null" setup>
import useCategoryTree from '@/hooks/useCategoryTree'

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
    const deepDisabled = (list: (ICategoryTreeEntity & { disabled?: boolean })[]) => {
      list.forEach((v) => {
        v.disabled = true

        if (v.children?.length) {
          v.children = deepDisabled(v.children)
        }
      })

      return list
    }

    return categoryTree.value.map((v) => {
      const disabled = v.name === disabledName
      if (disabled && v.children?.length) {
        v.children = deepDisabled(v.children)
      }

      return {
        ...v,
        disabled
      }
    })
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

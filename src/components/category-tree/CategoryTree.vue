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
    const deepDisabled = (data: ICategoryTreeEntity & { disabled?: boolean }) => {
      if (data.name === disabledName) {
        data.disabled = true

        if (data.children?.length) {
          const children = data.children as (ICategoryTreeEntity & { disabled?: boolean })[]
          children.forEach((v) => {
            v.disabled = true

            if (v.children?.length) {
              v.children.map((val) => deepDisabled(val))
            }
          })

          data.children = children
        }

        return data
      }

      if (data.children?.length) {
        const children = data.children as (ICategoryTreeEntity & { disabled?: boolean })[]
        children.map((v) => {
          return deepDisabled(v)
        })

        data.children = children
      }

      return data
    }

    return categoryTree.value.map((v) => {
      return deepDisabled(v)
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

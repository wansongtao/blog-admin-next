<script lang="ts" setup>
import FormCategory from './FormCategory.vue'

import { addCategory } from '@/api/category'
import { filterUndefinedValue } from '@/utils'

import type { ICategoryParams } from '@/types/api/category'

const $emits = defineEmits<{
  success: []
}>()

const show = ref(false)
const loading = ref(false)
const onSubmit = async (data: ICategoryParams) => {
  loading.value = true
  const [err] = await addCategory(filterUndefinedValue(data))
  loading.value = false

  if (err) {
    return
  }

  show.value = false
  window.$message.success('成功添加分类')
  $emits('success')
}
</script>

<template>
  <div class="button-add">
    <n-button type="primary" @click="show = true">添加分类</n-button>

    <n-modal v-model:show="show">
      <n-card
        style="overflow-y: auto; width: 35%; max-height: 85vh"
        :header-style="{ textAlign: 'center' }"
        title="添加分类"
      >
        <form-category :loading @cancel="show = false" @submit="onSubmit" />
      </n-card>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped></style>

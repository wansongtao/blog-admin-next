<script lang="ts" setup>
import FormCategory from './FormCategory.vue'
import { getCategoryDetail, updateCategory } from '@/api/category'

import type { ICategoryDetailEntity, ICategoryParams } from '@/types/api/category'

const { id } = defineProps<{ id: number }>()
const $emits = defineEmits<{
  success: []
}>()

const show = ref(false)
const loading = ref(false)
const detail = ref<ICategoryDetailEntity>()

const onOpen = async () => {
  show.value = true
  loading.value = true
  const [, res] = await getCategoryDetail(id)
  loading.value = false

  if (!res) {
    window.$message.error('获取菜单详情失败')
    return
  }

  detail.value = res.data
}

const onSubmit = async (data: ICategoryParams) => {
  loading.value = true
  const [err] = await updateCategory(id, data)
  loading.value = false
  if (err) {
    return
  }

  show.value = false
  window.$message.success('成功修改分类信息')
  $emits('success')
}
</script>

<template>
  <div class="button-edit">
    <n-button type="warning" ghost size="small" @click="onOpen">编辑</n-button>

    <n-modal v-model:show="show" :auto-focus="false">
      <n-card
        style="overflow-y: auto; width: 35%; max-height: 85vh"
        :header-style="{ textAlign: 'center' }"
        title="编辑分类"
      >
        <form-category :detail :loading @cancel="show = false" @submit="onSubmit" />
      </n-card>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
import MenuForm from './MenuForm.vue'
import { updateMenu, getMenuDetail } from '@/api/menu'

import type { IMenuParam } from '@/types/api/menu'

const { id } = defineProps<{ id: number }>()
const $emits = defineEmits<{
  success: []
}>()

const show = ref(false)
const loading = ref(false)
const detail = ref<IMenuParam>()

const onOpen = async () => {
  show.value = true
  loading.value = true
  const [, res] = await getMenuDetail(id)
  loading.value = false

  if (!res) {
    window.$message.error('获取菜单详情失败')
    return
  }

  detail.value = res.data
}

const onSubmit = async (data: IMenuParam) => {
  loading.value = true
  const [err] = await updateMenu(id, data)
  loading.value = false
  if (err) {
    return
  }

  show.value = false
  window.$message.success('成功修改菜单信息')
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
        title="编辑菜单"
      >
        <menu-form :detail :loading @cancel="show = false" @submit="onSubmit" />
      </n-card>
    </n-modal>
  </div>
</template>

<style lang="scss" scoped></style>

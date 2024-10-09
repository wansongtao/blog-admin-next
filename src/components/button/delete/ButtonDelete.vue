<script
  lang="ts"
  generic="T extends number | string | number[] | string[], U extends number | string"
  setup
>
import type { AxiosError } from 'axios'

export type ButtonDeleteProps = {
  deleteItem: (id: number | string) => Promise<[err?: AxiosError, data?: any]>
  deleteItems: (ids: (number | string)[]) => Promise<[err?: AxiosError, data?: any]>
}

const { id, deleteItem, deleteItems } = defineProps<{
  id: T
  deleteItem: (id: U) => Promise<[err?: AxiosError, data?: any]>
  deleteItems: (ids: U[]) => Promise<[err?: AxiosError, data?: any]>
}>()

const $emits = defineEmits<{
  success: []
}>()

const isBatch = computed(() => Array.isArray(id))

const loading = ref(false)
const onConfirm = async () => {
  const isBatch = Array.isArray(id)
  if (isBatch && !id.length) {
    window.$message.warning('请先选择要批量删除的项')
    return
  }

  loading.value = true

  if (isBatch) {
    const [err] = await deleteItems(id as U[])
    loading.value = false
    if (err) return
    window.$message.success('批量删除成功')
    $emits('success')
    return
  }

  const [err] = await deleteItem(id as unknown as U)
  loading.value = false
  if (err) return
  window.$message.success('删除成功')
  $emits('success')
}
</script>

<template>
  <n-popconfirm @positive-click="onConfirm">
    <template #trigger>
      <n-button type="error" :loading :ghost="!isBatch" :size="isBatch ? 'medium' : 'small'">{{
        isBatch ? '批量删除' : '删除'
      }}</n-button>
    </template>
    {{ isBatch ? '请确认是否要批量删除选中项？' : '请确认是否删除该项？' }}
  </n-popconfirm>
</template>

<style lang="scss" scoped></style>

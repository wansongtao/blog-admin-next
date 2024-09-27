<script lang="ts" setup>
import { deleteMenu, deleteMenuList } from '@/api/menu'

const { id } = defineProps<{
  id: number | number[]
}>()
const $emits = defineEmits<{
  success: []
}>()

const isBatch = computed(() => Array.isArray(id))

const onConfirm = async () => {
  const isBatch = Array.isArray(id)
  if (isBatch && !id.length) {
    window.$message.warning('请选择要删除的菜单')
    return
  }

  if (isBatch) {
    const [err] = await deleteMenuList(id)
    if (err) return
    window.$message.success('批量删除成功')
    $emits('success')
    return
  }

  const [err] = await deleteMenu(id)
  if (err) return
  window.$message.success('删除成功')
  $emits('success')
}
</script>

<template>
  <n-popconfirm @positive-click="onConfirm">
    <template #trigger>
      <n-button type="error" :ghost="!isBatch" :size="isBatch ? 'medium' : 'small'">{{
        isBatch ? '批量删除' : '删除'
      }}</n-button>
    </template>
    {{ isBatch ? '请确认是否要批量删除这些菜单？' : '请确认是否删除该菜单？' }}
  </n-popconfirm>
</template>

<style lang="scss" scoped></style>

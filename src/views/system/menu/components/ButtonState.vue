<script lang="ts" setup>
import { updateMenu } from '@/api/menu'

import type { CSSProperties } from 'vue'

const { id } = defineProps<{
  id: number
}>()
const $emits = defineEmits<{
  success: []
}>()

const disabled = defineModel<boolean>()

const loading = ref(false)
const onChangeState = async (value: boolean) => {
  const [err] = await updateMenu(id, { disabled: value })
  if (err) {
    return
  }

  $emits('success')
  window.$message.success('操作成功')
  disabled.value = value
}

const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = '#d03050'
    if (focused) {
      style.boxShadow = '0 0 0 2px #d0305040'
    }
  }

  return style
}
</script>

<template>
  <n-switch :value="disabled" :loading @update:value="onChangeState" :rail-style="railStyle">
    <template #checked> 禁用 </template>
    <template #unchecked> 启用 </template>
  </n-switch>
</template>

<style lang="scss" scoped></style>

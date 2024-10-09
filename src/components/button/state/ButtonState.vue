<script lang="ts" setup>
import type { AxiosError } from 'axios'
import type { CSSProperties } from 'vue'

export type ButtonStateProps = {
  id: number | string
  updateFn: (
    id: number | string,
    data: { disabled?: boolean }
  ) => Promise<[err?: AxiosError, data?: any]>
}

const { id, updateFn } = defineProps<ButtonStateProps>()
const $emits = defineEmits<{
  success: []
}>()

const disabled = defineModel<boolean>()

const loading = ref(false)
const onChangeState = async (value: boolean) => {
  loading.value = true
  const [err] = await updateFn(id, { disabled: value })
  loading.value = false
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

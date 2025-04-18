<script lang="ts" setup>
import { updateCategory } from '@/api/category'
import { throttle } from '@/utils'

const { id, disabled } = defineProps<{ id: number; disabled?: boolean }>()
const $emits = defineEmits<{
  success: []
}>()

const state = defineModel<boolean>()
const loading = ref(false)
const onChangeState = throttle(async (value: boolean) => {
  loading.value = true
  const [err] = await updateCategory(id, { hidden: value })
  loading.value = false
  if (err) {
    return
  }

  window.$message.success(
    value ? '该分类状态更改为隐藏（前台不可见）' : '该分类状态更改为显示（前台可见）'
  )
  state.value = value
  $emits('success')
})
</script>

<template>
  <switch-state
    :value="state"
    :disabled
    :loading
    checked-text="隐藏"
    unchecked-text="显示"
    @update:value="onChangeState"
  />
</template>

<style lang="scss" scoped></style>

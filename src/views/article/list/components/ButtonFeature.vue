<script lang="ts" setup>
import { updateArticle } from '@/api/article'
import { throttle } from '@/utils'

const { id, disabled } = defineProps<{ id: number; disabled?: boolean }>()
const $emits = defineEmits<{
  success: []
}>()

const state = defineModel<boolean>()
const loading = ref(false)
const onChangeState = throttle(async (value: boolean) => {
  loading.value = true
  const [err] = await updateArticle(id, { featured: value })
  loading.value = false
  if (err) {
    return
  }

  window.$message.success(value ? '文章已置顶' : '文章已取消置顶')
  state.value = value
  $emits('success')
})
</script>

<template>
  <switch-state
    :value="state"
    :disabled
    :loading
    checked-text="是"
    unchecked-text="否"
    @update:value="onChangeState"
  />
</template>

<style lang="scss" scoped></style>

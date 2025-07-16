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
  const [err] = await updateArticle(id, { published: value })
  loading.value = false
  if (err) {
    return
  }

  window.$message.success(value ? '文章发布成功' : '文章已保存为草稿')
  state.value = value
  $emits('success')
})
</script>

<template>
  <switch-state
    :value="state"
    :disabled
    :loading
    checked-text="发布"
    unchecked-text="草稿"
    @update:value="onChangeState"
  />
</template>

<style lang="scss" scoped></style>

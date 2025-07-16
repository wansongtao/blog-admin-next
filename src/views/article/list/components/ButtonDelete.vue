<script lang="ts" setup>
import { deleteArticle } from '@/api/article'

const { id } = defineProps<{ id: number }>()
const $emits = defineEmits<{
  success: []
}>()

const disabled = ref(false)
const onConfirm = async () => {
  disabled.value = true
  const [err] = await deleteArticle(id)
  disabled.value = false
  if (err) {
    return
  }

  window.$message.success('成功删除文章')
  $emits('success')
}
</script>

<template>
  <button-confirm text="删除" ghost size="small" :disabled @confirm="onConfirm">
    您确定要删除该文章吗？
  </button-confirm>
</template>

<style lang="scss" scoped></style>

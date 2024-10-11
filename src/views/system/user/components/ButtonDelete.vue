<script lang="ts" setup>
import { deleteUser } from '@/api/user'

const { id } = defineProps<{ id: string }>()
const $emits = defineEmits<{
  success: []
}>()

const loading = ref(false)
const onConfirm = async () => {
  loading.value = true
  const [err] = await deleteUser(id)
  loading.value = false
  if (err) {
    return
  }

  $emits('success')
  window.$message.success('成功删除用户')
}
</script>

<template>
  <button-confirm text="删除" ghost size="small" :disabled="loading" @confirm="onConfirm">
    您确定要删除该用户账号吗？
  </button-confirm>
</template>

<style lang="scss" scoped></style>

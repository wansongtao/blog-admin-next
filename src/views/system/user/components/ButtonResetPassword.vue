<script lang="ts" setup>
import { resetUserPassword } from '@/api/user'

const { id } = defineProps<{ id: string }>()

const onConfirm = async () => {
  const [err, data] = await resetUserPassword(id)
  if (err) {
    return
  }

  window.$message.success(data?.message ?? '操作成功')
}
</script>

<template>
  <button-confirm text="重置密码" ghost size="small" type="primary" @confirm="onConfirm">
    您确定要重置密码吗？
  </button-confirm>
</template>

<style lang="scss" scoped></style>

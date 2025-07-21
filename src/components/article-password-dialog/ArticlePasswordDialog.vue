<script lang="ts" setup>
defineProps<{
  hint?: string
}>()
const show = defineModel<boolean>('show')

const emits = defineEmits<{
  success: [password: string]
}>()

const password = ref('')
const loading = ref(false)

const onSubmit = () => {
  if (!password.value.trim()) {
    window.$message.warning('请输入密码')
    return
  }

  emits('success', password.value)
  password.value = ''
}

const onCancel = () => {
  show.value = false
  password.value = ''
}
</script>

<template>
  <n-modal v-model:show="show">
    <n-card style="width: 400px" title="文章已加密" :bordered="false" size="huge">
      <div class="password-form">
        <p v-if="hint" class="hint">提示：{{ hint }}</p>
        <n-input
          v-model:value="password"
          type="password"
          placeholder="请输入密码"
          @keyup.enter="onSubmit"
          autofocus
          show-password-on="click"
        />
      </div>

      <template #footer>
        <div class="footer-actions">
          <n-button @click="onCancel">取消</n-button>
          <n-button type="primary" :loading="loading" @click="onSubmit"> 确认 </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>

<style scoped>
.password-form {
  margin: 20px 0;
}

.hint {
  margin-bottom: 12px;
  color: var(--text-color-3);
  font-size: 14px;
}

.footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

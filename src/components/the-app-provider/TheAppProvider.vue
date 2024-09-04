<script lang="ts" setup>
import { createTextVNode } from 'vue'

const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    function register() {
      window.$message = useMessage()
    }

    register()

    return () => createTextVNode()
  }
})
</script>

<template>
  <n-message-provider>
    <n-notification-provider>
      <n-modal-provider>
        <context-holder />
        <slot></slot>
      </n-modal-provider>
    </n-notification-provider>
  </n-message-provider>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { theme } from 'ant-design-vue'
import { useSettingStore } from '@/stores/setting'

const settingStore = useSettingStore()
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: settingStore.theme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm
    }"
  >
    <RouterView />
  </a-config-provider>
</template>

<style scoped></style>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { theme } from 'ant-design-vue'
import { useSettingStore } from '@/stores/setting'
import dayjs from 'dayjs';

import zhCN from 'ant-design-vue/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';

const settingStore = useSettingStore()

dayjs.locale('zh-cn');
</script>

<template>
  <a-config-provider
    :theme="{
      algorithm: settingStore.theme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm
    }"
    :locale="zhCN"
  >
    <RouterView />
  </a-config-provider>
</template>

<style scoped></style>

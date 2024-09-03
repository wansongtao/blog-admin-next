<script lang="ts" setup>
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <the-base-view />
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
import { zhCN, dateZhCN } from 'naive-ui'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <the-app-provider>
      <router-view />
    </the-app-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
import { STATUS } from '@/constants'

const { placeholder = '状态', clearable = true } = defineProps<{
  placeholder?: string
  clearable?: boolean
}>()
const disabled = defineModel<(typeof STATUS)[0]['value'] | null>()
</script>

<template>
  <n-select v-model:value="disabled" :options="STATUS" :placeholder :clearable />
</template>

<style lang="scss" scoped></style>

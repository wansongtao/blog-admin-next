<script lang="ts" setup>
defineProps<{
  disableSearch?: boolean
  loadingSearch?: boolean
  loadingReset?: boolean
}>()

defineEmits<{
  search: [e: MouseEvent]
  reset: [e: MouseEvent]
}>()
</script>

<template>
  <n-row :gutter="20">
    <n-col :span="12">
      <button-search
        :disabled="disableSearch"
        :loading="loadingSearch"
        @click="$emit('search', $event)"
      />
    </n-col>
    <n-col :span="12">
      <button-reset
        :disabled="loadingSearch"
        :loading="loadingReset"
        @click="$emit('reset', $event)"
      />
    </n-col>
  </n-row>
</template>

<style lang="scss" scoped></style>

<script lang="ts" setup>
defineProps<{
  label: string
  description: string
}>()
</script>

<template>
  <div class="field-description">
    <div>{{ label }}</div>
    <n-tooltip placement="top" trigger="hover" :width="100">
      <template #trigger>
        <n-tag :bordered="false" size="small"> ? </n-tag>
      </template>
      <span> {{ description }} </span>
    </n-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.field-description {
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;

  :deep(.n-tag) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0 0 4px;
    padding: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    font-size: 8px;
  }
}
</style>

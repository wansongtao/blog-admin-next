<script lang="ts" setup>
import useBaseQuery from '@/hooks/useBaseQuery'
import dayjs from 'dayjs'

import type { IQuery } from '@/types/api'

const { loading = false } = defineProps<{
  loading?: boolean
}>()

const $emits = defineEmits<{
  search: [data: IQuery]
  reset: []
}>()

const { keyword, dateRange } = useBaseQuery('category')
const disableSearch = computed(() => {
  if (keyword.value || dateRange.value) {
    return false
  }

  return true
})

const onSearch = () => {
  if (disableSearch.value) {
    return
  }

  const data: IQuery = {
    keyword: keyword.value ?? undefined
  }

  if (dateRange.value) {
    data.beginTime = dayjs(dateRange.value[0]).toISOString()
    data.endTime = dayjs(dateRange.value[1]).toISOString()
  }

  $emits('search', data)
}
const onReset = () => {
  keyword.value = null
  dateRange.value = null

  $emits('reset')
}

const disablePreviousDate = (ts: number) => {
  return ts > Date.now()
}
</script>

<template>
  <n-form inline :show-feedback="false" :show-label="false">
    <n-row :gutter="20">
      <n-col :span="8">
        <n-form-item>
          <n-input
            v-model:value="keyword"
            placeholder="分类名称关键字"
            clearable
            @keyup.enter="onSearch"
          />
        </n-form-item>
      </n-col>
      <n-col :span="12">
        <n-form-item>
          <n-date-picker
            v-model:value="dateRange"
            type="daterange"
            :is-date-disabled="disablePreviousDate"
            clearable
            style="width: 100%"
          />
        </n-form-item>
      </n-col>
      <n-col :span="4">
        <n-form-item>
          <n-row :gutter="20">
            <n-col :span="12">
              <button-search
                :disabled="disableSearch"
                :loading="loading && !disableSearch"
                @click="onSearch"
              />
            </n-col>
            <n-col :span="12">
              <button-reset :loading="loading && disableSearch" @click="onReset" />
            </n-col>
          </n-row>
        </n-form-item>
      </n-col>
    </n-row>
  </n-form>
</template>

<style lang="scss" scoped></style>

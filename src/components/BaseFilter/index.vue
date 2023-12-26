<script lang="ts" setup>
import { ref, computed } from 'vue'
import dayjs, { type Dayjs } from 'dayjs'

import { SearchOutlined, SyncOutlined } from '@ant-design/icons-vue'

defineOptions({
  name: 'baseFilter'
})
const $emits = defineEmits<{
  handleSearch: [query: { keyword?: string; startTime?: string; endTime?: string }]
  handleReset: []
}>()
const $props = withDefaults(
  defineProps<{
    rangePresets?: { label: string; value: [Dayjs, Dayjs] }[]
    disabledDate?: (current: Dayjs) => boolean
    dateFormat?: string
    showTime?: boolean
    placeholder?: string
    gutter?: number
    span?: number
    allowEmpty?: [boolean, boolean]
    disabledSearch?: boolean
    loading?: boolean
  }>(),
  {
    rangePresets: () => [
      { label: '今天', value: [dayjs().hour(0).minute(0).second(0), dayjs()] },
      {
        label: '昨天',
        value: [
          dayjs().add(-1, 'd').hour(0).minute(0).second(0),
          dayjs().add(-1, 'd').hour(23).minute(59).second(59)
        ]
      },
      { label: '最近3天', value: [dayjs().add(-3, 'd'), dayjs()] },
      { label: '最近7天', value: [dayjs().add(-7, 'd'), dayjs()] },
      { label: '最近14天', value: [dayjs().add(-14, 'd'), dayjs()] },
      { label: '最近30天', value: [dayjs().add(-30, 'd'), dayjs()] },
      { label: '最近90天', value: [dayjs().add(-90, 'd'), dayjs()] }
    ],
    disabledDate: (current: Dayjs) => {
      // Can not select days before today and today
      return current && current > dayjs().endOf('day')
    },
    dateFormat: 'YYYY-MM-DD HH:mm:ss',
    showTime: true,
    placeholder: '请输入关键字',
    gutter: 20,
    span: 12,
    allowEmpty: () => [true, true],
    disabledSearch: true,
    loading: false
  }
)

const query = ref<{
  keyword: string
  dateRange: [string, string] | undefined
}>({
  keyword: '',
  dateRange: undefined
})

const isDisabledSearch = computed(() => {
  const { keyword, dateRange } = query.value
  return $props.disabledSearch && !keyword && !dateRange
})

const type = ref<'search' | 'reset'>('search')
const handleSearch = () => {
  const { keyword, dateRange } = query.value
  const startTime = dateRange ? dateRange[0] : ''
  const endTime = dateRange ? dateRange[1] : ''

  type.value = 'search'
  $emits('handleSearch', { keyword, startTime, endTime })
}

const handleReset = () => {
  query.value = {
    keyword: '',
    dateRange: undefined
  }

  type.value = 'reset'
  $emits('handleReset')
}
</script>

<template>
  <div class="base_filter">
    <div class="base_filter_form">
      <a-row :gutter="gutter">
        <a-col :span="span">
          <a-input v-model:value="query.keyword" allow-clear :placeholder="placeholder" />
        </a-col>
        <a-col :span="span">
          <a-range-picker
            style="width: 100%"
            v-model:value="query.dateRange"
            :allow-empty="allowEmpty"
            :presets="rangePresets"
            :show-time="showTime"
            :disabled-date="disabledDate"
            :format="dateFormat"
            :value-format="dateFormat"
          />
        </a-col>
        <slot />
      </a-row>
    </div>
    <div class="base_filter_btn">
      <a-button
        type="primary"
        :disabled="isDisabledSearch"
        :loading="loading && type === 'search'"
        @click="handleSearch"
      >
        <template #icon>
          <SearchOutlined />
        </template>
        查询
      </a-button>
      <a-button
        style="margin-left: 12px"
        :disabled="loading && type !== 'reset'"
        :loading="loading && type === 'reset'"
        @click="handleReset"
      >
        <template #icon>
          <SyncOutlined />
        </template>
        重置
      </a-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.base_filter {
  display: flex;
  justify-content: space-between;

  .base_filter_form {
    flex: 1;
  }

  .base_filter_btn {
    flex-shrink: 0;
    margin-left: 24px;
    width: 176px;
  }
}
</style>

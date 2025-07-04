<script lang="ts" setup>
import { useRouteQuery } from '@vueuse/router'
import useBaseQuery from '@/hooks/useBaseQuery'
import dayjs from 'dayjs'

import type { IArticleQuery, IArticleVisibility } from '@/types/api/article'

const { loading = false } = defineProps<{
  loading?: boolean
}>()

const $emits = defineEmits<{
  search: [data: IArticleQuery]
  reset: []
}>()

const disablePreviousDate = (ts: number) => {
  return ts > Date.now()
}

const { keyword, dateRange } = useBaseQuery('article')
const categoryId = useRouteQuery<IArticleQuery['categoryId']>('article-category', null)
const visibility = useRouteQuery<IArticleQuery['visibility']>('article-visibility', null)
const visibilityOptions: { label: string; value: IArticleVisibility }[] = [
  {
    label: '私密',
    value: 'PRIVATE'
  },
  {
    label: '管理员可见',
    value: 'INTERNAL'
  },
  {
    label: '公开',
    value: 'PUBLIC'
  }
]

const published = useRouteQuery('article-published', null, {
  transform: (val: string | null) => {
    if (!val) {
      return val as null
    }

    return Number(val) as IArticleQuery['published']
  }
})
const featured = useRouteQuery('article-featured', null, {
  transform: (val: string | null) => {
    if (!val) {
      return val as null
    }

    return Number(val) as IArticleQuery['featured']
  }
})

const disableSearch = computed(() => {
  if (
    keyword.value ||
    categoryId.value ||
    dateRange.value ||
    visibility.value ||
    published.value ||
    featured.value
  ) {
    return false
  }

  return true
})

const onSearch = () => {
  if (disableSearch.value) {
    return
  }

  const data: IArticleQuery = {
    keyword: keyword.value ?? undefined,
    categoryId: categoryId.value ?? undefined,
    visibility: visibility.value ?? undefined,
    published: published.value ?? undefined,
    featured: featured.value ?? undefined
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
  categoryId.value = null
  visibility.value = null
  published.value = null
  featured.value = null

  $emits('reset')
}
</script>

<template>
  <n-form inline :show-feedback="false" :show-label="false">
    <n-row :gutter="10">
      <n-col :span="4">
        <n-form-item>
          <n-input
            v-model:value="keyword"
            placeholder="标题、摘要关键字"
            clearable
            :maxlength="50"
            @keyup.enter="onSearch"
          />
        </n-form-item>
      </n-col>
      <n-col :span="3">
        <n-form-item>
          <category-tree v-model="categoryId" placeholder="请选择分类" />
        </n-form-item>
      </n-col>
      <n-col :span="3">
        <n-form-item>
          <n-select
            v-model:value="visibility"
            :options="visibilityOptions"
            placeholder="可见性"
            clearable
          />
        </n-form-item>
      </n-col>
      <n-col :span="2">
        <n-form-item>
          <n-select
            v-model:value="published"
            :options="[
              {
                label: '草稿',
                value: 0
              },
              {
                label: '发布',
                value: 1
              }
            ]"
            placeholder="发布"
            clearable
          />
        </n-form-item>
      </n-col>
      <n-col :span="2">
        <n-form-item>
          <n-select
            v-model:value="featured"
            :options="[
              {
                label: '非置顶',
                value: 0
              },
              {
                label: '置顶',
                value: 1
              }
            ]"
            placeholder="置顶"
            clearable
          />
        </n-form-item>
      </n-col>
      <n-col :span="6">
        <n-form-item>
          <n-date-picker
            v-model:value="dateRange"
            type="daterange"
            :is-date-disabled="disablePreviousDate"
            clearable
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

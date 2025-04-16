<script lang="ts" setup>
import FormSearch from './components/FormSearch.vue'
import ButtonAdd from './components/ButtonAdd.vue'

import { getCategoryList } from '@/api/category'
import useRequest from '@/hooks/useRequest'
import useTableSort from '@/hooks/useTableSort'
import dayjs from 'dayjs'

import type { IQuery } from '@/types/api'
import type { ICategoryEntity } from '@/types/api/category'
import type { IColumn } from '@/types'

const { page, pageSize, list, total, loading, fetchList } = useRequest(async (params: IQuery) => {
  const [, result] = await getCategoryList(params)
  const data = result?.data.list ?? []
  const total = result?.data.total ?? 0

  return {
    data,
    total
  }
})

const search = ref<IQuery>({})
const onSearch = (data: IQuery) => {
  search.value = data
  page.value = 1
}
const onReset = () => {
  search.value = {}
  page.value = 1
}

const { sort, onSorterChange } = useTableSort()
const updateTableData = () => {
  fetchList({ ...search.value, sort: sort.value })
}

watch(
  [page, pageSize, search, sort],
  () => {
    updateTableData()
  },
  { immediate: true }
)

const columns = computed(() => {
  const list: IColumn<ICategoryEntity>[] = [
    {
      align: 'center',
      key: 'name',
      title: '名称'
    },
    {
      align: 'center',
      key: 'description',
      title: '描述',
      ellipsis: {
        tooltip: true
      },
      render: (row) => row.description || '--'
    },
    {
      align: 'center',
      key: 'hidden',
      title: '隐藏分类',
      render: (row) => (row.hidden ? '是' : '否')
    },
    {
      align: 'center',
      key: 'sort',
      title: '排序',
      width: 60
    },
    {
      align: 'center',
      key: 'createdAt',
      title: '创建时间',
      defaultSortOrder: sort.value === 'asc' ? 'ascend' : 'descend',
      sorter: true,
      width: 200,
      render(row) {
        return dayjs(row.createdAt).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      align: 'center',
      key: 'updatedAt',
      title: '更新时间',
      width: 200,
      render(row) {
        return dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  ]

  return list
})

const expandedRowKeys = ref<number[]>([])
watch(list, (value) => {
  if (value.length === 0) return
  const item = value.find((v) => {
    if (v.children?.length) {
      return true
    }
  })

  expandedRowKeys.value = item !== undefined ? [item.id] : []
})
</script>

<template>
  <base-box>
    <form-search :loading @search="onSearch" @reset="onReset" />
    <check-permission permission="system:category:add">
      <n-space style="margin-top: 20px">
        <button-add @success="updateTableData" />
      </n-space>
    </check-permission>
    <div class="main">
      <n-data-table
        :columns="columns"
        :data="list"
        v-model:expanded-row-keys="expandedRowKeys"
        :row-key="(rowData: ICategoryEntity) => rowData.id"
        :loading
        style="height: 100%"
        flex-height
        striped
        @update:sorter="onSorterChange"
      />
    </div>
    <base-pagination v-model:page="page" v-model:page-size="pageSize" :total :disabled="loading" />
  </base-box>
</template>

<style lang="scss" scoped>
.main {
  flex: 1;
  margin: 20px 0;
}
</style>

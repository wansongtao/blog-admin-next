<script lang="ts" setup>
import SearchForm from './components/SearchForm.vue'
import ButtonAdd from './components/ButtonAdd.vue'
import useRequest from '@/hooks/useRequest'
import useTableSort from '@/hooks/useTableSort'
import { getRoleList } from '@/api/role'

import type { IQuery } from '@/types/api'
import type { DataTableColumn } from 'naive-ui'
import type { IRoleListItem } from '@/types/api/role'

const { sort, onSorterChange } = useTableSort()

const { page, pageSize, list, total, loading, fetchList } = useRequest(async (params: IQuery) => {
  const [, result] = await getRoleList(params)
  const data = result?.data.list ?? []
  const total = result?.data.total ?? 0

  return {
    data,
    total
  }
})

const search = ref<IQuery>({})
const updateTableData = () => {
  fetchList({ ...search.value, sort: sort.value })
}

const onSearch = (data: IQuery) => {
  search.value = data
  page.value = 1
}
const onReset = () => {
  search.value = {}
  page.value = 1
}

watch(
  [page, pageSize, search, sort],
  () => {
    updateTableData()
  },
  { immediate: true }
)

type IColumn = DataTableColumn<IRoleListItem> & { key?: keyof IRoleListItem | 'action' }
const columns = computed(() => {
  const columnList: IColumn[] = [
    {
      align: 'center',
      key: 'id',
      title: '角色ID'
    },
    {
      align: 'center',
      key: 'name',
      title: '角色名称'
    },
    {
      align: 'center',
      key: 'description',
      title: '角色描述'
    },
    {
      align: 'center',
      key: 'disabled',
      title: '状态',
      render: ({ disabled }) => {
        return disabled ? '禁用' : '启用'
      }
    },
    {
      align: 'center',
      key: 'createdAt',
      title: '创建时间',
      defaultSortOrder: sort.value === 'asc' ? 'ascend' : 'descend',
      sorter: true,
      width: 200
    },
    {
      align: 'center',
      key: 'updatedAt',
      title: '更新时间',
      width: 200
    }
  ]

  return columnList
})
</script>

<template>
  <base-box>
    <search-form :loading @search="onSearch" @reset="onReset" />
    <check-permission :permission="['system:role:add']">
      <n-space style="margin-top: 20px">
        <check-permission permission="system:role:add">
          <button-add @success="updateTableData" />
        </check-permission>
      </n-space>
    </check-permission>
    <div class="table">
      <n-data-table
        :columns="columns"
        :data="list"
        :loading
        :cascade="false"
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
.table {
  flex: 1;
  margin: 20px 0;
}
</style>

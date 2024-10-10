<script lang="ts" setup>
import SearchForm from './components/SearchForm.vue'
import ButtonAdd from './components/ButtonAdd.vue'
import useRequest from '@/hooks/useRequest'
import useTableSort from '@/hooks/useTableSort'
import { getUserList } from '@/api/user'

import { NSpace, NTag, type DataTableColumn } from 'naive-ui'
import type { IQuery } from '@/types/api'
import type { IUserListItem } from '@/types/api/user'

type IColumn = DataTableColumn<IUserListItem> & { key?: keyof IUserListItem | 'action' }

const { page, pageSize, list, total, loading, fetchList } = useRequest(async (params: IQuery) => {
  const [, result] = await getUserList(params)
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
  const list: IColumn[] = [
    {
      align: 'center',
      key: 'userName',
      title: '用户名'
    },
    {
      align: 'center',
      key: 'nickName',
      title: '昵称'
    },
    {
      align: 'center',
      key: 'avatar',
      title: '头像',
      render: (row) => {
        return row.avatar
          ? h('img', {
              src: row.avatar,
              alt: 'avatar',
              style: {
                margin: '0 auto',
                width: '40px',
                height: '40px',
                borderRadius: '50%'
              }
            })
          : '--'
      }
    },
    {
      align: 'center',
      key: 'roleNames',
      title: '角色',
      render: (row) => {
        if (!row.roleNames?.length) {
          return '--'
        }

        return h(
          NSpace,
          { justify: 'center' },
          {
            default: () =>
              row.roleNames!.map((role) => h(NTag, { type: 'info' }, { default: () => role }))
          }
        )
      }
    },
    {
      align: 'center',
      key: 'disabled',
      title: '状态',
      render: (row) => {
        return row.disabled ? '禁用' : '启用'
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

  return list
})
</script>

<template>
  <base-box>
    <search-form :loading @search="onSearch" @reset="onReset" />
    <check-permission or :permission="['system:user:add']">
      <n-space style="margin-top: 20px">
        <check-permission permission="system:user:add">
          <button-add @success="updateTableData" />
        </check-permission>
      </n-space>
    </check-permission>
    <div class="table">
      <n-data-table
        :columns="columns"
        :data="list"
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
.table {
  flex: 1;
  margin: 20px 0;
}
</style>

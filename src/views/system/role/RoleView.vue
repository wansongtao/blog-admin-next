<script lang="ts" setup>
import { NSpace } from 'naive-ui'
import SearchForm from './components/SearchForm.vue'
import ButtonAdd from './components/ButtonAdd.vue'
import ButtonDelete from './components/ButtonDelete.vue'
import ButtonState from './components/ButtonState.vue'
import ButtonEdit from './components/ButtonEdit.vue'

import useTableSort from '@/hooks/useTableSort'
import { getRoleList } from '@/api/role'
import usePermission from '@/hooks/usePermission'
import usePagination from '@/hooks/usePagination'
import useFetchList from '@/hooks/useFetchList'
import dayjs from 'dayjs'

import type { IQuery } from '@/types/api'
import type { IRoleListItem } from '@/types/api/role'
import type { IColumn } from '@/types'

const { page, pageSize } = usePagination({ cacheKey: 'role' })
const { sort, onSorterChange } = useTableSort()

const search = ref<IQuery>({})
const onSearch = (data: IQuery) => {
  search.value = data
  page.value = 1
}
const onReset = () => {
  search.value = {}
  page.value = 1
}

const { list, total, loading, fetchList } = useFetchList(
  async () => {
    const [, result] = await getRoleList({
      ...search.value,
      page: page.value,
      pageSize: pageSize.value,
      sort: sort.value
    })
    const data = result?.data.list ?? []
    const total = result?.data.total ?? 0

    return {
      data,
      total
    }
  },
  { watchers: [page, pageSize, sort, search] }
)

const checkedKeys = ref<number[]>([])
const onDeleteSuccess = (isBatch = false) => {
  let deleteCount = 1
  if (isBatch) {
    deleteCount = checkedKeys.value.length
    checkedKeys.value = []
  }

  const lastPageSize = total.value % pageSize.value || pageSize.value
  if (deleteCount < lastPageSize || page.value === 1) {
    fetchList()
    return
  }

  const lastPage = Math.ceil(total.value / pageSize.value)
  const currentLastPage = Math.ceil((total.value - deleteCount) / pageSize.value)
  page.value = Math.max(1, page.value - (lastPage - currentLastPage))
}

const { hasPermission } = usePermission()
const columns = computed(() => {
  const hasEditPermission = hasPermission('system:role:edit')

  const list: IColumn<IRoleListItem>[] = [
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
      title: '角色描述',
      ellipsis: {
        tooltip: true
      },
      render: ({ description }) => description || '--'
    },
    {
      align: 'center',
      key: 'disabled',
      title: '状态',
      render: (row) => {
        return h(ButtonState, {
          id: row.id,
          modelValue: row.disabled,
          disabled: !hasEditPermission
        })
      }
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

  const hasDeletePermission = hasPermission('system:role:del')
  if (hasDeletePermission) {
    list.unshift({
      type: 'selection'
    })
  }

  if (hasDeletePermission || hasEditPermission) {
    const action: IColumn<IRoleListItem> = {
      align: 'center',
      key: 'action',
      title: '操作',
      render(row) {
        const deleteButton = h(ButtonDelete, {
          id: row.id,
          onSuccess: onDeleteSuccess
        })
        const editButton = h(ButtonEdit, { id: row.id, onSuccess: fetchList })

        if (hasDeletePermission && hasEditPermission) {
          return h(
            NSpace,
            { justify: 'center' },
            {
              default: () => [editButton, deleteButton]
            }
          )
        }

        if (hasDeletePermission) {
          return deleteButton
        }

        if (hasEditPermission) {
          return editButton
        }
      }
    }

    list.push(action)
  }

  return list
})
</script>

<template>
  <base-box>
    <search-form :loading @search="onSearch" @reset="onReset" />
    <check-permission permission="system:role:add">
      <n-space style="margin-top: 20px">
        <button-add @success="fetchList" />
      </n-space>
    </check-permission>
    <div class="table">
      <n-data-table
        v-model:checked-row-keys="checkedKeys"
        :columns="columns"
        :data="list"
        :loading
        style="height: 100%"
        flex-height
        striped
        :row-key="(rowData: IRoleListItem) => rowData.id"
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

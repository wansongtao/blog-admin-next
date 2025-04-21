<script lang="ts" setup>
import FormSearch from './components/FormSearch.vue'
import ButtonAdd from './components/ButtonAdd.vue'
import ButtonEdit from './components/ButtonEdit.vue'
import SwitchStateHidden from './components/SwitchStateHidden.vue'
import ButtonDelete from './components/ButtonDelete.vue'
import { NSpace } from 'naive-ui'

import { getCategoryList } from '@/api/category'
import useTableSort from '@/hooks/useTableSort'
import dayjs from 'dayjs'
import usePermission from '@/hooks/usePermission'
import useTableExpandRow from '@/hooks/useTableExpandRow'
import usePagination from '@/hooks/usePagination'
import useFetchList from '@/hooks/useFetchList'

import type { IQuery } from '@/types/api'
import type { ICategoryEntity } from '@/types/api/category'
import type { IColumn } from '@/types'

const { page, pageSize } = usePagination({ isCache: true, cacheKey: 'category' })
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
    const [, result] = await getCategoryList({
      ...search.value,
      sort: sort.value,
      page: page.value,
      pageSize: pageSize.value
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

function onDeleteSuccess() {
  const lastPageSize = total.value % pageSize.value || pageSize.value
  const lastPage = Math.ceil(total.value / pageSize.value)
  if (page.value === lastPage && lastPageSize === 1) {
    page.value = Math.max(1, page.value - 1)
    return
  }

  fetchList()
}

const { hasPermission } = usePermission()
const columns = computed(() => {
  const hasEditPermission = hasPermission('system:category:edit')

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
      render: (row) => {
        return h(SwitchStateHidden, {
          id: row.id,
          modelValue: row.hidden,
          disabled: !hasEditPermission
        })
      }
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

  const hasDelPermission = hasPermission('system:category:del')
  if (hasEditPermission || hasDelPermission) {
    const action: IColumn<ICategoryEntity> = {
      align: 'center',
      key: 'action',
      title: '操作',
      render(row) {
        const editButton = h(ButtonEdit, { id: row.id, onSuccess: fetchList })
        const deleteButton = h(ButtonDelete, {
          id: row.id,
          onSuccess: onDeleteSuccess
        })

        if (hasDelPermission && hasEditPermission) {
          return h(
            NSpace,
            { justify: 'center' },
            {
              default: () => [editButton, deleteButton]
            }
          )
        }

        if (hasDelPermission) {
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

const { expandedRowKeys } = useTableExpandRow(list, true)
</script>

<template>
  <base-box>
    <form-search :loading @search="onSearch" @reset="onReset" />
    <check-permission permission="system:category:add">
      <n-space style="margin-top: 20px">
        <button-add @success="fetchList" />
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

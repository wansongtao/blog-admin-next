<script lang="ts" setup>
import { NSpace } from 'naive-ui'
import SearchForm from './components/SearchForm.vue'
import TagMenu from './components/TagMenu.vue'
import ButtonAdd from './components/ButtonAdd.vue'
import ButtonState from './components/ButtonState.vue'
import ButtonEdit from './components/ButtonEdit.vue'
import ButtonDelete from './components/ButtonDelete.vue'
import ButtonDeleteBatch from './components/ButtonDeleteBatch.vue'

import { getMenuList } from '@/api/menu'
import MENU_ICON_MAP from '@/plugins/menuIcons'
import useTableSort from '@/hooks/useTableSort'
import usePermission from '@/hooks/usePermission'
import useTableExpandRow from '@/hooks/useTableExpandRow'
import usePagination from '@/hooks/usePagination'
import useFetchList from '@/hooks/useFetchList'
import dayjs from 'dayjs'

import type { IMenuListItem, IMenuQuery } from '@/types/api/menu'
import type { IColumn } from '@/types'

const { page, pageSize } = usePagination({ cacheKey: 'menu' })
const { sort, onSorterChange } = useTableSort()

const search = ref<IMenuQuery>({})
const onSearch = (data: IMenuQuery) => {
  search.value = data
  page.value = 1
}
const onReset = () => {
  search.value = {}
  page.value = 1
}

const { list, total, loading, fetchList } = useFetchList(
  async () => {
    const [, result] = await getMenuList({
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

const { expandedRowKeys } = useTableExpandRow(list)

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
  const hasEditPermission = hasPermission('system:menu:edit')

  const list: IColumn<IMenuListItem>[] = [
    {
      align: 'center',
      key: 'name',
      title: '菜单名称'
    },
    {
      align: 'center',
      key: 'type',
      title: '菜单类型',
      width: 100,
      render(row) {
        return h(TagMenu, { type: row.type })
      }
    },
    {
      align: 'center',
      key: 'path',
      title: '路由地址',
      render(row) {
        return row.path || '--'
      }
    },
    {
      align: 'center',
      key: 'permission',
      title: '权限标识',
      ellipsis: {
        tooltip: true
      },
      render(row) {
        return row.permission || '--'
      }
    },
    {
      align: 'center',
      key: 'icon',
      title: '图标',
      width: 60,
      render(row) {
        if (!row.icon || !MENU_ICON_MAP[row.icon]) return '--'

        return h(MENU_ICON_MAP[row.icon])
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
      key: 'disabled',
      title: '状态',
      render(row) {
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
    }
  ]

  const hasDeletePermission = hasPermission('system:menu:del')
  if (hasDeletePermission) {
    list.unshift({
      type: 'selection'
    })
  }

  if (hasDeletePermission || hasEditPermission) {
    const action: IColumn<IMenuListItem> = {
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
    <check-permission or :permission="['system:menu:del', 'system:menu:add']">
      <n-space style="margin-top: 20px">
        <check-permission permission="system:menu:add">
          <button-add @success="fetchList" />
        </check-permission>
        <check-permission permission="system:menu:del">
          <button-delete-batch
            :id="checkedKeys"
            @success="onDeleteSuccess(true)"
            @failed="checkedKeys = []"
          />
        </check-permission>
      </n-space>
    </check-permission>
    <div class="menu-table">
      <n-data-table
        :columns="columns"
        :data="list"
        :loading
        v-model:expanded-row-keys="expandedRowKeys"
        v-model:checked-row-keys="checkedKeys"
        :row-key="(rowData: IMenuListItem) => rowData.id"
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
.menu-table {
  flex: 1;
  margin: 20px 0;
}
</style>

<script lang="ts" setup>
import SearchForm from './components/SearchForm.vue'
import TagMenu from './components/TagMenu.vue'
import useRequest from '@/hooks/useRequest'
import { getMenuList } from '@/api/menu'
import MENU_ICON_MAP from '@/plugins/menuIcons'

import type { IMenuListItem, IMenuQuery } from '@/types/api/menu'
import type { DataTableColumn } from 'naive-ui'

const columns: (DataTableColumn<IMenuListItem> & { key: keyof IMenuListItem })[] = [
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
      return row.disabled ? '禁用' : '启用'
    }
  },
  {
    align: 'center',
    key: 'createdAt',
    title: '创建时间',
    sorter: true,
    width: 200
  }
]

const { page, pageSize, list, total, loading, fetchList } = useRequest(
  async (params: IMenuQuery) => {
    const [, result] = await getMenuList(params)
    const data = result?.data.list ?? []
    const total = result?.data.total ?? 0

    return {
      data,
      total
    }
  }
)

const search = ref<IMenuQuery>({})
const onSearch = (data: IMenuQuery) => {
  search.value = data
  page.value = 1
}
const onReset = () => {
  search.value = {}
  page.value = 1
}

watch(
  [page, pageSize, search],
  () => {
    fetchList(search.value)
  },
  { immediate: true }
)

const expandedRowKeys = ref<number[]>([])
watch(
  list,
  (value) => {
    if (value.length === 0) return
    expandedRowKeys.value = [value[0].id]
  },
  { immediate: true }
)
</script>

<template>
  <base-box>
    <search-form :loading @search="onSearch" @reset="onReset" />
    <div class="menu-table">
      <n-data-table
        :columns="columns"
        :data="list"
        :loading
        v-model:expanded-row-keys="expandedRowKeys"
        :pagination="false"
        :cascade="false"
        :row-key="(rowData: IMenuListItem) => rowData.id"
        style="height: 100%"
        flex-height
        striped
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

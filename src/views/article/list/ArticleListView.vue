<script lang="ts" setup>
import FormSearch from './components/FormSearch.vue'
import { NSpace, NTag } from 'naive-ui'
import ButtonDetail from './components/ButtonDetail.vue'
import ButtonEdit from './components/ButtonEdit.vue'
import ButtonPublish from './components/ButtonPublish.vue'
import ButtonFeature from './components/ButtonFeature.vue'

import usePagination from '@/hooks/usePagination'
import useTableSort from '@/hooks/useTableSort'
import { getArticleList } from '@/api/article'
import useFetchList from '@/hooks/useFetchList'
import dayjs from 'dayjs'
import usePermission from '@/hooks/usePermission'

import type { IArticleListItem, IArticleQuery } from '@/types/api/article'
import type { IColumn } from '@/types'

const { page, pageSize } = usePagination({ cacheKey: 'menu' })
const { sort, onSorterChange } = useTableSort()

const search = ref<IArticleQuery>({})
const onSearch = (data: IArticleQuery) => {
  search.value = data
  page.value = 1
}
const onReset = () => {
  search.value = {}
  page.value = 1
}

const { list, total, loading, fetchList } = useFetchList(
  async () => {
    const [, result] = await getArticleList({
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

const { hasPermission } = usePermission()
const columns = computed(() => {
  const hasEditPermission = hasPermission('system:role:edit')
  const hasDeletePermission = hasPermission('system:article:del')

  const list: IColumn<IArticleListItem>[] = [
    {
      align: 'center',
      key: 'author',
      title: '作者',
      ellipsis: {
        tooltip: true
      },
      width: 100
    },
    {
      align: 'center',
      key: 'categoryName',
      title: '分类',
      ellipsis: {
        tooltip: true
      },
      width: 80
    },
    {
      align: 'center',
      key: 'title',
      title: '标题',
      ellipsis: {
        tooltip: true
      },
      width: 100
    },
    {
      align: 'center',
      key: 'coverImage',
      title: '封面',
      width: 70,
      render: ({ coverImage }) => {
        if (!coverImage) {
          return '--'
        }

        return h('img', {
          src: coverImage,
          style: { width: '60px', height: '30px', objectFit: 'cover' },
          alt: '封面图片'
        })
      }
    },
    {
      align: 'center',
      key: 'visibility',
      title: '可见性',
      render: ({ visibility }) => {
        switch (visibility) {
          case 'PRIVATE':
            return h(NTag, { type: 'error' }, () => '私密')
          case 'INTERNAL':
            return h(NTag, { type: 'warning' }, () => '内部')
          case 'PUBLIC':
            return h(NTag, { type: 'success' }, () => '公开')
          default:
            return '--'
        }
      }
    },
    {
      align: 'center',
      key: 'summary',
      title: '摘要',
      width: 100,
      ellipsis: {
        tooltip: true
      },
      render: ({ summary }) => summary || '--'
    },
    {
      align: 'center',
      key: 'published',
      title: '发布状态',
      width: 100,
      render: (row) => {
        return h(ButtonPublish, {
          id: row.id,
          modelValue: row.published,
          disabled: !hasEditPermission
        })
      }
    },
    {
      align: 'center',
      key: 'featured',
      title: '置顶',
      render: (row) => {
        return h(ButtonFeature, {
          id: row.id,
          modelValue: row.featured,
          disabled: !hasEditPermission
        })
      }
    },
    {
      align: 'center',
      key: 'updatedAt',
      title: '更新时间',
      defaultSortOrder: sort.value === 'asc' ? 'ascend' : 'descend',
      sorter: true,
      width: 120,
      render(row) {
        return dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')
      }
    },
    {
      align: 'center',
      key: 'publishedAt',
      title: '发布时间',
      width: 120,
      render(row) {
        return row.publishedAt ? dayjs(row.publishedAt).format('YYYY-MM-DD HH:mm:ss') : '--'
      }
    },
    {
      align: 'center',
      key: 'action',
      title: '操作',
      render(row) {
        const detailButton = h(ButtonDetail, { id: row.id })
        const components = [detailButton]
        if (hasEditPermission) {
          const editButton = h(ButtonEdit, { id: row.id })
          components.unshift(editButton)
        }

        return h(
          NSpace,
          { justify: 'center', wrap: false },
          {
            default: () => components
          }
        )
      }
    }
  ]

  if (hasDeletePermission) {
    list.unshift({
      type: 'selection'
    })
  }

  return list
})
</script>

<template>
  <base-box>
    <form-search @search="onSearch" @reset="onReset" />

    <check-permission permission="system:article:add">
      <n-space style="margin-top: 20px">
        <n-button type="primary" @click="$router.push('/article/draft')">创作中心</n-button>
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
        :row-key="(rowData: IArticleListItem) => rowData.id"
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

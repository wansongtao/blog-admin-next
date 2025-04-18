import { deepForeach } from '@/utils/index'

import type { Ref, ShallowRef } from 'vue'

export default function useTableExpandRow<T extends { id: number | string; children?: T[] }>(
  list: Ref<T[]> | ShallowRef<T[]>,
  defaultExpandAll = false
) {
  const expandedRowKeys = ref<T['id'][]>([])

  watch(list, (value) => {
    if (value.length === 0) return

    if (!defaultExpandAll) {
      const item = value.find((v) => {
        if (v.children?.length) {
          return true
        }
      })

      expandedRowKeys.value = item !== undefined ? [item.id] : []
      return
    }

    const ids: T['id'][] = []
    deepForeach(value, (v) => {
      if (v.children?.length) {
        ids.push(v.id)
      }
    })
    expandedRowKeys.value = ids
  })

  return {
    expandedRowKeys
  }
}

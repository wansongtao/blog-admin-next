import { getArticleDetail } from '@/api/article'

import type { IArticleDetail } from '@/types/api/article'

export const useArticleDetail = () => {
  const detail = ref<IArticleDetail | null>(null)
  const route = useRoute()

  watch(
    () => route.query.id,
    async (id) => {
      if (id && +id > 0) {
        const [, res] = await getArticleDetail(+id)
        if (res) {
          detail.value = res.data
          return
        }
      }

      detail.value = null
    },
    { immediate: true }
  )

  return {
    detail
  }
}

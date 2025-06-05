import { getArticleVisibilityList } from '@/api/article'

import type { IArticleVisibilityListItem } from '@/types/api/article'

export default function useArticleVisibility(immediate = true) {
  const visibilityList = ref<IArticleVisibilityListItem[]>([])

  const fetchVisibilityList = async () => {
    const [, res] = await getArticleVisibilityList()
    if (!res) {
      return
    }

    visibilityList.value = res.data
  }

  if (immediate) {
    fetchVisibilityList()
  }

  return {
    visibilityList,
    fetchVisibilityList
  }
}

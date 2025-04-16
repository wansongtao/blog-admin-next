import { getCategoryTree } from '@/api/category'

import type { ICategoryTreeEntity } from '@/types/api/category'

export default function useCategoryTree(immediate = false) {
  const categoryTree = ref<ICategoryTreeEntity[]>([])

  const fetchCategoryTree = async () => {
    const [, result] = await getCategoryTree()
    categoryTree.value = result?.data ?? []
  }

  if (immediate) {
    fetchCategoryTree()
  }

  return {
    categoryTree,
    fetchCategoryTree
  }
}

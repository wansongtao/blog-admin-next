import { useRouteQuery } from '@vueuse/router'

export default function usePagination({
  defaultPage = 1,
  defaultPageSize = 10,
  isCache = true,
  cacheKey = ''
} = {}) {
  if (!cacheKey) {
    cacheKey = (useRoute().name as string).toLowerCase()
  }

  const page = isCache
    ? useRouteQuery(cacheKey + 'page', defaultPage, { transform: Number })
    : ref(defaultPage)
  const pageSize = isCache
    ? useRouteQuery(cacheKey + 'size', defaultPageSize, { transform: Number })
    : ref(defaultPageSize)

  return {
    page,
    pageSize
  }
}

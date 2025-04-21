import type { Ref, ShallowRef, WatchOptions, WatchSource } from 'vue'

export type IRequest<T> = () => Promise<{ data: T[]; total: number }>

interface IRequestReturn {
  total: Ref<number>
  loading: Ref<boolean>
}

export interface IOption {
  /**
   * 监听项列表，如果有一项变化了，则自动重新请求数据
   */
  watchers?: WatchSource[]
  watchOption?: WatchOptions
}

export function useFetchList<T>(request: IRequest<T>): {
  list: Ref<T[]>
  watch?: IOption
} & IRequestReturn

export function useFetchList<T>(
  request: IRequest<T>,
  watch: IOption | undefined,
  isShallow: true
): {
  list: ShallowRef<T[]>
} & IRequestReturn

export default function useFetchList<T>(
  request: IRequest<T>,
  { watchers = [], watchOption = { immediate: true, deep: true } }: IOption = {},
  isShallow = false
) {
  const list: Ref<T[]> | ShallowRef<T[]> = !isShallow ? ref([]) : shallowRef([])
  const loading = ref(false)
  const total = ref(0)

  const fetchList = () => {
    loading.value = true

    request()
      .then((res) => {
        list.value = res.data
        total.value = res.total
      })
      .finally(() => {
        loading.value = false
      })
  }

  if (watchers?.length) {
    watch(watchers, fetchList, watchOption)
  }

  return {
    list,
    total,
    loading,
    fetchList
  }
}

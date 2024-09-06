export const useAppSetStore = defineStore(
  'appSet',
  () => {
    const collapsed = ref(false)
    function toggleCollapsed() {
      collapsed.value = !collapsed.value
    }

    return {
      collapsed,
      toggleCollapsed
    }
  },
  { persist: true }
)

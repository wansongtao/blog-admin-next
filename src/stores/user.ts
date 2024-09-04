export const useUserStore = defineStore(
  'user',
  () => {
    const accessToken = ref('')
    const refreshToken = ref('')

    return {
      accessToken,
      refreshToken
    }
  },
  { persist: true }
)

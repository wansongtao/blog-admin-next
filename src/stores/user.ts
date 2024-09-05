import { setLogin } from '@/api/common'

import type { ILoginParams } from '@/types/api/common'

export const useUserStore = defineStore(
  'user',
  () => {
    const accessToken = ref('')
    const refreshToken = ref('')
    async function login(data: ILoginParams) {
      const [, res] = await setLogin(data)
      if (!res) {
        return false
      }

      accessToken.value = res.data.token
      refreshToken.value = res.data.refreshToken
      return true
    }

    return {
      accessToken,
      refreshToken,
      login
    }
  },
  { persist: true }
)

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStorage, setStorage, removeStorage } from 'web-storage-plus'
import type { ILoginParams, IUserinfoData } from '@/types/common/index'
import { setLogin, setLogout, getUserInfo } from '@/api/common'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<IUserinfoData>({
    nickName: '',
    avatar: '',
    permissions: [],
    roles: []
  })
  function getUserInfoAction() {
    return new Promise<IUserinfoData>((resolve, reject) => {
      getUserInfo()
        .then((res) => {
          userInfo.value = res.data
          resolve(res.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  const token = ref('')
  function getToken() {
    if (token.value) {
      return token.value
    }
    token.value = (getStorage('token') as string) || ''
    return token.value
  }
  function setToken(value: string) {
    token.value = value
    setStorage('token', value)
  }
  function removeToken() {
    token.value = ''
    removeStorage('token')
  }

  function login(data: ILoginParams) {
    return new Promise<void>((resolve, reject) => {
      setLogin(data)
        .then((res) => {
          setToken(res.data)
          getUserInfoAction()
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  }
  function logout() {
    return new Promise<void>((resolve) => {
      setLogout().then(() => {
        removeToken()
        resolve()
      })
    })
  }

  return {
    userInfo,
    getUserInfoAction,
    token,
    getToken,
    setToken,
    removeToken,
    login,
    logout
  }
})

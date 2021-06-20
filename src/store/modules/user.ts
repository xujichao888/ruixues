import { defineStore } from 'pinia'
import { store } from '@/store'
import router from '@/router'
import { getToken, setToken } from '@/utils/cache'
import { PageEnum } from '@/enums/pageEnum'
import { login, getUserInfo } from '@/api/sys/user'
import type { LoginParams } from '@/api/sys/user'
import { usePermissionStoreWidthOut } from './permission'

export interface UserInfo {
  name: string
  avatar: string
  permissions: string[]
}

interface UserState {
  userInfo: Nullable<UserInfo>
  token?: string
  permissions: string[]
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: getToken(),
    // roleList
    permissions: [],
  }),
  getters: {
    getUserInfo(): UserInfo {
      return this.userInfo || ({} as UserInfo)
    },
  },
  actions: {
    async login(params: LoginParams) {
      const { token } = await login(params)
      this.token = token
      setToken(token)
    },
    async requestUserInfo() {
      if (this.token === '') {
        throw Error('GetUserInfo: token is undefined!')
      }
      const data = await getUserInfo()
      if (!data.permissions) {
        throw Error('Actions is required.')
      }
      data.avatar = data.avatar || 'https://picsum.photos/id/1068/100/100'
      const { permissions } = data
      this.userInfo = data
      this.permissions = permissions
    },
    async logout(params?: { redirect?: string }) {
      this.reset()
      const redirect = params?.redirect
      usePermissionStoreWidthOut().resetRoutes()
      router.replace({
        path: PageEnum.BASE_LOGIN,
        query: {
          redirect,
        },
      })
    },
    reset() {
      this.token = undefined
      this.userInfo = null
      this.permissions = []
    },
  },
})

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store)
}

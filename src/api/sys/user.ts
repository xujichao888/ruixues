import { RequestEnum } from '@/enums/httpEnum'
import { UserInfo } from '@/store/modules/user'
import { request } from '@/utils/axios'

export interface LoginParams {
  username: string
  password: string
}

export const getUserInfo = () =>
  request<UserInfo>({
    url: 'users/info',
  })

export const login = (data: LoginParams) =>
  request({
    url: 'users/login',
    method: RequestEnum.POST,
    data,
  })

import { useGlobSetting } from '@/hooks/setting'
import { useUserStoreWidthOut } from '@/store/modules/user'
import axios, { AxiosInstance } from 'axios'
import { isString } from 'lodash'
import { formatRequestDate } from './helper'
import { tranformResponseError, transformResponseHook } from './transform'

const { apiUrl, urlPrefix } = useGlobSetting()

export const service = axios.create({
  baseURL: apiUrl,
  timeout: 5000,
  responseType: 'json',
})
export const request = service.request.bind(service) as <T = any>(
  ...args: Parameters<AxiosInstance['request']>
) => Promise<T>

service.interceptors.request.use(
  (options) => {
    const { joinPrefix = true, formatDate = true, ...config } = options
    // Add X-Access-Token header to every request, you can add other custom headers here
    const userStore = useUserStoreWidthOut()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    if (joinPrefix && urlPrefix) {
      const url = config.url || ''
      config.url = `${urlPrefix.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
    }
    if (formatDate) {
      const format = isString(formatDate) ? formatDate : undefined
      formatRequestDate(config.params, format)
      formatRequestDate(config.data, format)
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(transformResponseHook, tranformResponseError)

export default service

import Cookies from 'js-cookie'
import { TOKEN_KEY } from '@/enums/cacheEnum'

const domain = window.location.hostname.replace(/.*?([A-z]+\.[A-z]+)$/g, '$1')
export const getToken = () => Cookies.get(TOKEN_KEY)
export const setToken = (token: string) =>
  Cookies.set(TOKEN_KEY, token, { domain, path: '/', expires: 7 })
export const removeToken = () => Cookies.remove(TOKEN_KEY, { domain, path: '/' })

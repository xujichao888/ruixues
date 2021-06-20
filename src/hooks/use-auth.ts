import { useUserStore } from '@/store/modules/user'
import { intersection, isString } from 'lodash'

export function useAuth() {
  const { permissions } = useUserStore()
  function hasPermission(value: string | string[], def = true): boolean {
    if (!value) {
      return def
    }
    if (isString(value)) {
      return permissions.includes(value)
    }
    if (!Array.isArray(value)) {
      throw new Error(`${hasPermission.name}: value must be array or string`)
    }
    return intersection(value, permissions).length > 0
  }

  return {
    hasPermission,
  }
}

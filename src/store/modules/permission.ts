import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'
import { store } from '@/store'
import router, { asyncRoutes } from '@/router'
import constantRoutes from '@/router/constantRoutes'

const hasPermission = (keys: string[], route: RouteRecordRaw) => {
  const permissions = route.meta?.permissions
  if (permissions) {
    return keys.some((role) => permissions.includes(role))
  } else {
    return true
  }
}

export const filterAsyncRoutes = (routes: RouteRecordRaw[], permissions: string[]) => {
  const res: RouteRecordRaw[] = []
  routes.forEach((route) => {
    const r: RouteRecordRaw = { ...route }
    if (hasPermission(permissions, r)) {
      if (r.children) {
        r.children = filterAsyncRoutes(r.children, permissions)
      }
      res.push(r)
    }
  })
  return res
}

export interface PermissionState {
  routes: RouteRecordRaw[]
  dynamicRoutes: RouteRecordRaw[]
  routesForRemove: (() => void)[]
}

function sortRoute(routes: RouteRecordRaw[]) {
  routes.sort((a, b) => (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0))
  routes.forEach((route) => route.children && sortRoute(route.children))
}

export const usePermissionStore = defineStore({
  id: 'permission',
  state: (): PermissionState => ({
    routes: [],
    dynamicRoutes: [],
    routesForRemove: [],
  }),
  actions: {
    generateRoutes(permissions: string[]) {
      const data: any[] = []
      const accessedRoutes = filterAsyncRoutes(data.concat(asyncRoutes), permissions)
      this.dynamicRoutes = accessedRoutes
      this.routes = constantRoutes.concat(accessedRoutes)
      sortRoute(this.routes as RouteRecordRaw[])
      accessedRoutes.forEach((route) => {
        this.routesForRemove.push(router.addRoute(route))
      })
    },
    resetRoutes() {
      this.dynamicRoutes = []
      this.routes = constantRoutes
      this.routesForRemove.forEach((remove) => remove())
      sortRoute(this.routes as RouteRecordRaw[])
    },
  },
})

// Need to be used outside the setup
export function usePermissionStoreWidthOut() {
  return usePermissionStore(store)
}

import { App } from '@vue/runtime-core'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import constantRoutes, { PAGE_NOT_FOUND_ROUTE } from '@/router/constantRoutes'
import { setupRouterGuard } from './guard'

// 添加静态路由
const router = createRouter({
  history: createWebHistory(
    window.__POWERED_BY_QIANKUN__
      ? import.meta.env.VITE_GLOB_APP_SHORT_NAME
      : import.meta.env.VITE_PUBLIC_PATH
  ),
  routes: constantRoutes,
})

export const setupRouter = (app: App<Element>) => {
  setupRouterGuard()
  app.use(router)
}

const modules = import.meta.globEager('./modules/**/*.ts')

const routeModuleList: RouteRecordRaw[] = []

Object.keys(modules).forEach((key) => {
  const mod = modules[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  routeModuleList.push(...modList)
})

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList]

export default router

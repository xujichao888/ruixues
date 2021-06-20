import type { RouteRecordRaw } from 'vue-router'
import { ERROR_PAGE_COMPONENT, LAYOUT, REDIRECT_NAME } from '@/router/constant'
import { PageEnum } from '@/enums/pageEnum'

export const REDIRECT_ROUTE: RouteRecordRaw = {
  path: '/redirect',
  name: REDIRECT_NAME,
  component: LAYOUT,
  meta: {
    title: REDIRECT_NAME,
    hideMenu: true,
    hideBreadcrumb: true,
  },
  children: [
    {
      path: '/redirect/:path(.*)',
      name: REDIRECT_NAME,
      component: () => import('@/views/sys/redirect/index.vue'),
      meta: {
        title: REDIRECT_NAME,
        hideMenu: true,
        hideBreadcrumb: true,
      },
    },
  ],
}

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'Page404',
  component: LAYOUT,
  meta: {
    title: '404',
    hideBreadcrumb: true,
    hideMenu: true,
  },
  children: [
    {
      path: '/:path(.*)*',
      name: 'Page404',
      component: ERROR_PAGE_COMPONENT,
      meta: {
        title: '404',
        hideBreadcrumb: true,
      },
    },
  ],
}

const constantRoutes: RouteRecordRaw[] = [
  REDIRECT_ROUTE,
  {
    path: '/',
    component: LAYOUT,
    redirect: PageEnum.BASE_HOME,
    meta: {
      orderNo: 0,
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/sys/dashboard/index.vue'),
        meta: {
          title: '控制面板',
          icon: 'el-icon-help',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/sys/login/index.vue'),
    meta: {
      title: '登录',
      ignoreAuth: true,
      hideMenu: true,
    },
  },
]

export default constantRoutes

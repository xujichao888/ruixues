import router from '@/router'
import { createActiveMenuGuard } from './active-menu-guard'
import { createPageTitleGuard } from './page-title-guard'
import { createPermissionGuard } from './permission-guard'
import { createProgressGuard } from './progress-guard'

export function setupRouterGuard() {
  createProgressGuard(router)
  createPermissionGuard(router)
  createPageTitleGuard(router)
  createActiveMenuGuard(router)
}

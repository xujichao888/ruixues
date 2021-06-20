import { useAPPStoreWidthOut } from '@/store/modules/app'
import type { Router } from 'vue-router'

export function createActiveMenuGuard(router: Router) {
  router.beforeEach((to) => {
    useAPPStoreWidthOut().setCurrentActiveMenu(to)
    return true
  })
}

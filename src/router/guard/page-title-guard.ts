import { useAPPStoreWidthOut } from '@/store/modules/app'
import type { Router } from 'vue-router'

export function createPageTitleGuard(router: Router) {
  router.afterEach(async (to) => {
    document.title = `${to.meta.title}-${useAPPStoreWidthOut().title}`
    return true
  })
}

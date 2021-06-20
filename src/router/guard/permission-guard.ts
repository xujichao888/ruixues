import type { Router } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { usePermissionStoreWidthOut } from '@/store/modules/permission'
import { PageEnum } from '@/enums/pageEnum'
import { useUserStoreWidthOut } from '@/store/modules/user'
import { PAGE_NOT_FOUND_ROUTE } from '@/router/constantRoutes'
import { MessageErrorEnum } from '@/enums/messageEnum'

const LOGIN_PATH = PageEnum.BASE_LOGIN

const whitePathList: PageEnum[] = [LOGIN_PATH]

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWidthOut()
  const permissionStore = usePermissionStoreWidthOut()
  router.beforeEach(async (to, from) => {
    // Jump to the 404 page after processing the login
    if (from.path === LOGIN_PATH && to.name === PAGE_NOT_FOUND_ROUTE.name) {
      return PageEnum.BASE_HOME
    }

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path as PageEnum)) {
      return true
    }

    const token = userStore.token

    // token does not exist
    if (!token) {
      // You can access without permission. You need to set the routing meta.ignoreAuth to true
      if (
        to.meta.ignoreAuth
        // || to.name === FULL_PAGE_NOT_FOUND_ROUTE.name
      ) {
        return true
      }
      // redirect login page
      const redirectData: { path: string; replace: boolean; query?: Recordable<string> } = {
        path: LOGIN_PATH,
        replace: true,
      }
      if (to.path) {
        redirectData.query = {
          ...redirectData.query,
          redirect: to.path,
        }
      }
      return redirectData
    }
    try {
      if (!userStore.permissions.length) {
        const redirect = from.query.redirect && decodeURIComponent(from.query.redirect as string)
        const nextData = redirect ? { path: redirect } : { ...to, replace: true }
        await userStore.requestUserInfo()
        await permissionStore.generateRoutes(userStore.permissions)
        return nextData
      } else {
        return true
      }
    } catch (error) {
      ElMessageBox.alert(error.message || 'Has Error', {
        title: MessageErrorEnum.ERROR_TITLE,
      })
      return {
        path: PageEnum.BASE_LOGIN,
        query: {
          redirect: to.path,
        },
      }
    }
  })
}

import type { RouteLocationNormalizedLoaded } from 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    // title
    title?: string

    // Whether to ignore permissions
    ignoreAuth?: boolean

    // permission's keys info
    permissions?: string[]

    // icon
    icon?: string

    // Whether the route has been dynamically added
    hideBreadcrumb?: boolean

    // Never show in menu
    hideMenu?: boolean

    // Hide submenu
    hideChildrenInMenu?: boolean

    // Currently active menu
    currentActiveMenu?: string | ((to: RouteLocationNormalizedLoaded) => string)

    orderNo?: number

    href?: string
    target?: '_blank' | '_self' | '_parent' | '_top'

    badge?: {
      value?: string | number
      isDot?: boolean
      hidden?: boolean
      type?: string
    }
  }
}

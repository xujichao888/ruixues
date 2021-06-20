export interface GlobConfig {
  // Site title
  title: string
  // Service interface url
  apiUrl: string
  //  Service interface url prefix
  urlPrefix?: string
  // Project abbreviation
  shortName: string
}

export interface GlobEnvConfig {
  // Site title
  VITE_GLOB_APP_TITLE: string
  // Service interface url
  VITE_GLOB_API_URL: string
  // Service interface url prefix
  VITE_GLOB_API_URL_PREFIX?: string
  // Project abbreviation
  VITE_GLOB_APP_SHORT_NAME: string
}

export interface APPConfig {
  // only show the main content, to used in qiankun or iframe
  fullContent: boolean
  // whether show logo in sidebar
  showSidebarLogo: boolean
  // whether show breadcrumbs
  showBreadcrumb: boolean
  // whether fixed header
  fixedHeader: boolean
  // sidebar menu width
  sidebarWidth: number
  // navbar height
  navbarHeight: number
  // fixed navbar
  navbarFixed: boolean
}

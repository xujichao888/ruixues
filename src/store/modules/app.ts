import { defineStore } from 'pinia'
import { store } from '@/store'
import { APPConfig } from '@/types/config'
import APPSettings from '@/settings/app'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export interface APPState extends APPConfig {
  title: string
  sidebarOpened: boolean
  currentActiveMenu: string
}

export const useAPPStore = defineStore({
  id: 'app',
  state: (): APPState => ({
    ...APPSettings,
    fullContent: window.__POWERED_BY_QIANKUN__ || false,
    title: import.meta.env.VITE_GLOB_APP_TITLE,
    sidebarOpened: true,
    currentActiveMenu: '/',
  }),
  getters: {
    getSidebarWidth(): number {
      return this.sidebarOpened ? this.sidebarWidth : 64
    },
  },
  actions: {
    toggleSidebar(open?: boolean) {
      if (open === undefined) {
        open = !this.sidebarOpened
      }
      this.sidebarOpened = Boolean(open)
    },
    setCurrentActiveMenu(to: RouteLocationNormalizedLoaded) {
      let menu = to.meta?.currentActiveMenu
      if (!menu) {
        // default is to.path
        menu = to.path
      } else if (typeof menu === 'function') {
        // a function to get active menu
        menu = menu(to)
      }
      this.currentActiveMenu = menu
    },
  },
})

// Need to be used outside the setup
export function useAPPStoreWidthOut() {
  return useAPPStore(store)
}

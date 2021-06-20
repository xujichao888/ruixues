import type { App, PropType as VuePropType } from 'vue'

declare global {
  const __APP_INFO__: {
    pkg: {
      name: string
      version: string
    }
    lastBuildTime: string
  }

  declare interface Window {
    // Global vue app instance
    __APP__: App<Element>
    // for qiankun
    __POWERED_BY_QIANKUN__?: boolean
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string
  }
  // for qiankun
  let __webpack_public_path__: string

  // vue
  declare type PropType<T> = VuePropType<T>

  declare type EmitType = (event: string, ...args: any[]) => void

  declare type Recordable<T = any> = Record<string, T>

  declare type Nullable<T> = T | null

  declare type Undefinable<T> = T | undefined

  declare interface ImportMetaEnv extends ViteEnv {
    __: unknown
  }

  declare interface ViteEnv {
    VITE_PORT: number
    VITE_USE_MOCK: boolean
    VITE_PUBLIC_PATH: string
    VITE_GLOB_APP_TITLE: string
    VITE_GLOB_APP_SHORT_NAME: string
    VITE_DROP_CONSOLE: boolean
    VITE_GLOB_API_URL: string
    VITE_GLOB_API_URL_PREFIX: string
  }
}

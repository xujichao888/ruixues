import type { GlobConfig } from '#/config'

export const useGlobSetting = (): Readonly<GlobConfig> => {
  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: import.meta.env.VITE_GLOB_APP_TITLE,
    shortName: import.meta.env.VITE_GLOB_APP_SHORT_NAME,
    apiUrl: import.meta.env.VITE_GLOB_API_URL,
    urlPrefix: import.meta.env.VITE_GLOB_API_URL_PREFIX,
  }
  return glob
}

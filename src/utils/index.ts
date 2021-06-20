import { isExternal } from './is'

/**
 * Resolve relative path against a root path
 * https://github.com/pillarjs/resolve-path
 *
 * @param {string} rootPath
 * @param {string} relativePath
 * @return {string}
 */
export function resolvePath(rootPath: string, relativePath: string) {
  const ABSOLUTE_PATH_REGEXP = /^[\\/]/
  const ABSOLUTE_END_PATH_REGEXP = /([\\/])$/
  const path = relativePath
  let root = rootPath

  if (typeof root !== 'string') {
    throw new TypeError(`${resolvePath.name}argument rootPath must be a string`)
  }

  if (typeof path !== 'string') {
    throw new TypeError(`${resolvePath.name}argument relativePath must be a string`)
  }

  if (ABSOLUTE_PATH_REGEXP.test(path) || isExternal(path)) {
    return path
  }

  if (!ABSOLUTE_END_PATH_REGEXP.test(root) && path) {
    if (root.includes('/')) {
      root += '/'
    } else {
      root += '\\'
    }
  }

  return `${root}${path}`
}

/**
 * @name insertVconsole
 * @desc 插入 vconsole
 */
export const insertVconsole = async () => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const script = document.createElement('script')
      script.onload = () => {
        new (window as any).VConsole({
          onReady() {
            resolve()
          },
        })
      }
      script.onerror = reject
      script.src = 'https://cdn.jsdelivr.net/npm/vconsole'
      document.body.append(script)
    } catch (err) {
      console.warn(err)
      reject(err)
    }
  })
}

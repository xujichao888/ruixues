import { readFileSync } from 'fs'
import { resolve } from 'path'
import APPSettings from '../src/settings/app'

function readVariables(path: string) {
  // $--avatar-text-font-size: 14px !default;
  const fileContent = readFileSync(resolve(__dirname, path), {
    encoding: 'utf-8',
  })
  const matchResult = [...fileContent.matchAll(/(\$.*?):\s?([\s\S]*?);/g)]
  const variables: Recordable<string> = {}
  matchResult.forEach((item) => {
    variables[item[1]] = item[2]
  })
  return variables
}

function stringifyVariables(vars: Recordable<string | number>) {
  let result = ''
  for (const key in vars) {
    if (Object.prototype.hasOwnProperty.call(vars, key)) {
      result += `${key}: ${vars[key]};`
    }
  }
  return result
}

export function getThemeVariables() {
  const originVariables = readVariables(
    '../node_modules/element-plus/packages/theme-chalk/src/common/var.scss'
  )
  const customVariables = readVariables('../src/styles/vars/customize-variables.scss')
  const variables = {
    ...originVariables,
    ...customVariables,
    '$navbar-height': `${APPSettings.navbarHeight}px`,
    '$sidebar-width': `${APPSettings.sidebarWidth}px`,
  }
  return stringifyVariables(variables)
}

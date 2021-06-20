import { createApp } from 'vue'
import qs from 'querystring'
import ElementPlus from 'element-plus'
import mitt from 'mitt'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'virtual:windi.css'
import '@/styles/index.scss'
import App from '@/App.vue'
import { setupRouter } from '@/router'
import { insertVconsole } from '@/utils'
import { useGlobSetting } from '@/hooks/setting'
import { setupStore } from '@/store'
import { setupDirectives } from '@/directives'

const { shortName } = useGlobSetting()
const app = createApp(App)

app.config.globalProperties.mittBus = mitt()

const initInstance = () => {
  setupStore(app)
  setupRouter(app)
  setupDirectives(app)
  app.use(ElementPlus, { locale }).mount(`#app-${shortName}`, true)
}

const mountApp = () => {
  const queries = qs.parse(window.location.search.slice(1))
  if (queries.debug) {
    insertVconsole().then(initInstance).catch(initInstance)
  } else {
    initInstance()
  }
}

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '/'
} else {
  mountApp()
}

export async function bootstrap() {
  console.info(`${shortName} bootstraped`)
}

export async function mount() {
  mountApp()
}

export async function unmount() {
  app && app.unmount()
}

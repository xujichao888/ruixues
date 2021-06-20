import { useAuth } from '@/hooks/use-auth'
import type { App, Directive } from 'vue'

const authDirective: Directive = {
  mounted(el: Element, binding) {
    const { hasPermission } = useAuth()
    const value = binding.value
    if (!value) return
    if (!hasPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  },
}

export function setupAuthDirective(app: App) {
  app.directive('auth', authDirective)
}

export default authDirective

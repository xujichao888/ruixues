import { unref } from 'vue'
import type { Ref, SetupContext } from 'vue'

interface Props {
  expose: SetupContext['expose']
  children: {
    methods: string[]
    component: Ref
  }[]
  methods?: Recordable
}

export default function useChildrenExpose({ expose, children, methods: extraMethods }: Props) {
  const methods: Recordable = {
    ...extraMethods,
  }
  children.forEach(({ methods: keys, component }) => {
    keys.forEach((key) => {
      methods[key] = function (...args: any[]) {
        const comp = unref(component)
        const fn = comp![key as never]
        if (typeof fn !== 'function') {
          console.warn(component, key + 'is not a function')
          return
        }
        return fn(...args)
      }
    })
  })

  expose(methods)
}

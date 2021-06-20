import { onMounted, onUnmounted, ref } from 'vue'
import { debounce, isNumber } from 'lodash'
import SCREENS, { ScreenKey } from '@/settings/screens'
import { ColProps } from '@/components/form-plus/types'

export const useScreens = () => {
  const activeScreen = ref<ScreenKey>('xl')
  // element not support 2xl
  const keys: ScreenKey[] = ['xl', 'lg', 'md', 'sm', 'xs']

  const resize = debounce(function () {
    const { innerWidth: width } = window
    for (const key of keys) {
      const value = SCREENS[key] as number
      if (key === 'xs') {
        if (width < value) {
          activeScreen.value = key
          break
        }
      } else if (width >= value) {
        activeScreen.value = key
        break
      }
    }
  }, 500)

  function getCol(props: ColProps): number {
    const { offset, pull, push } = props
    const displacement = [offset, pull, push].reduce(
      (prev: number, curr) => prev + (curr || 0),
      0
    ) as number
    for (const key of keys) {
      const value = props[key]
      if (key === activeScreen.value) {
        if (isNumber(value)) {
          return value + displacement
        } else {
          return getCol(props) + displacement
        }
      }
    }
    return (props.span || 24) + displacement
  }

  onMounted(() => {
    resize()
    window.addEventListener('resize', resize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', resize)
  })

  return {
    activeScreen,
    getCol,
  }
}

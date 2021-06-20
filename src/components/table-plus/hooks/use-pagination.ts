import { computed, ComputedRef, ref, unref } from 'vue'
import { isBoolean } from 'lodash'
import { Pagination } from '../types'

const CURRENT_PAGE = 1
const PAGE_SIZE = 10
const TOTAL = 0
const PAGER_COUNT = 5
const PAGE_SIZES = [10, 20, 50, 100]
const LAYOUT = 'total, sizes, prev, pager, next, jumper'

export function usePagination(props: ComputedRef<{ pagination: Pagination }>) {
  const config = ref<Pagination>({})
  const hidden = ref(false)
  const isHidden = computed(() => {
    const { pagination } = unref(props)
    return unref(hidden) || (isBoolean(pagination) && !pagination)
  })
  const getPaginationInfo = computed<Pagination | false>(() => {
    const { pagination } = unref(props)
    if (isHidden.value) {
      return false
    }

    return {
      currentPage: CURRENT_PAGE,
      pageSize: PAGE_SIZE,
      total: TOTAL,
      pagerCount: PAGER_COUNT,
      pageSizes: PAGE_SIZES,
      layout: LAYOUT,
      ...(isBoolean(pagination) ? {} : pagination),
      ...unref(config),
    }
  })

  function setPagination(info: Pagination) {
    const paginationInfo = unref(getPaginationInfo)
    config.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    }
  }

  function setHidePagination(bool: boolean) {
    hidden.value = bool
  }

  return {
    getPaginationInfo,
    isHidden,
    setPagination,
    setHidePagination,
  }
}

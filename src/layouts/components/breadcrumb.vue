<template>
  <el-breadcrumb v-if="showBreadcrumb">
    <el-breadcrumb-item
      v-for="route in breadcrumbList"
      :key="route.path"
      :to="route.redirect || route.path"
    >
      {{ route.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watchEffect } from 'vue'
import type { RouteLocationMatched } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAPPStore } from '@/store/modules/app'

export default defineComponent({
  name: 'Breadcrumb',
  setup() {
    const { currentRoute } = useRouter()
    const breadcrumbList = ref<RouteLocationMatched[]>([])
    const showBreadcrumb = computed(() => useAPPStore().showBreadcrumb)

    if (showBreadcrumb.value) {
      watchEffect(() => {
        const matched = currentRoute.value.matched
        breadcrumbList.value = matched.filter((item, index) => {
          if (item.redirect && item.redirect === matched[index + 1]?.path) {
            return false
          }
          return !item.meta?.hideBreadcrumb
        })
      })
    }

    return {
      breadcrumbList,
      showBreadcrumb,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  ::v-deep(.el-breadcrumb__inner) {
    font-weight: normal;
  }
}
</style>

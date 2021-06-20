<template>
  <el-container class="layout-default-container" :class="{ 'layout-header--fixed': navbarFixed }">
    <sidebar />

    <el-container direction="vertical" :style="{ paddingLeft: sidebarWidth }">
      <layout-header :style="{ width: `calc(100% - ${sidebarWidth})` }" />

      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import Sidebar from '@/layouts/components/sidebar/index.vue'
import LayoutHeader from '@/layouts/components/header/index.vue'
import { useAPPStore } from '@/store/modules/app'

export default defineComponent({
  name: 'LayoutDefault',
  components: {
    Sidebar,
    LayoutHeader,
  },
  setup() {
    const APPStore = useAPPStore()
    const sidebarWidth = computed(() => `${APPStore.getSidebarWidth}px`)
    const navbarFixed = computed(() => APPStore.navbarFixed)

    return {
      sidebarWidth,
      navbarFixed,
    }
  },
})
</script>

<style lang="scss" scoped>
.layout-header--fixed {
  .el-container {
    padding-top: $navbar-height;
  }

  .el-header {
    position: fixed;
    top: 0;
  }
}
</style>

<template>
  <el-aside class="sidebar-container" :width="sidebarWidth">
    <el-scrollbar wrap-class="scrollbar-wrapper" :class="{ 'show-logo': showLogo }">
      <sidebar-logo v-if="showLogo" :collapse="isCollapse" class="sidebar-logo-container" />
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="var(--menu-bg)"
        :unique-opened="false"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-menu
          v-for="route in routes"
          :key="route.path"
          :route="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </el-aside>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useAPPStore } from '@/store/modules/app'
import SidebarLogo from './logo.vue'
import SidebarMenu from './menu.vue'
import { useRoute } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { usePermissionStore } from '@/store/modules/permission'

export default defineComponent({
  name: 'Sidebar',
  components: {
    SidebarLogo,
    SidebarMenu,
  },
  setup() {
    const APPStore = useAPPStore()
    const permissionStore = usePermissionStore()
    const { path, meta } = useRoute()

    const isCollapse = computed(() => !APPStore.sidebarOpened)
    const sidebarWidth = computed(() => `${APPStore.getSidebarWidth}px`)
    const showLogo = computed(() => APPStore.showSidebarLogo)
    const activeMenu = computed(() => (meta.currentActiveMenu ? meta.currentActiveMenu : path))
    const routes = computed(() => permissionStore.routes as RouteRecordRaw[])

    return {
      sidebarWidth,
      showLogo,
      isCollapse,
      activeMenu,
      routes,
    }
  },
})
</script>

<style lang="scss" scoped>
.sidebar-container {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  background-color: $menu-bg;

  .scrollbar-wrapper {
    height: 100%;
    overflow-x: hidden !important;
  }

  &::v-deep(.horizontal-collapse-transition) {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
  }

  &::v-deep(.el-scrollbar__view) {
    height: 100%;
  }

  &::v-deep(.el-scrollbar__bar) {
    &.is-vertical {
      right: 0;
    }

    &.is-horizontal {
      display: none;
    }
  }
}

.el-scrollbar {
  height: 100%;

  &.show-logo {
    padding-top: $navbar-height;
  }
}

.sidebar-logo-container {
  position: absolute;
  top: 0;
  left: 0;
}

.el-menu {
  width: 100% !important;
  height: 100%;
  border: none;
}
</style>

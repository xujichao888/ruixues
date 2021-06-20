<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img src="/favicon.ico" class="sidebar-logo" />
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img src="/favicon.ico" class="sidebar-logo" />
        <h1 class="sidebar-title">
          {{ title }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts">
import { useAPPStore } from '@/store/modules/app'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SidebarLogo',
  props: {
    collapse: {
      required: true,
      type: Boolean,
    },
  },
  setup() {
    return {
      title: useAPPStore().title,
    }
  },
})
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: $navbar-height;
  overflow: hidden;
  line-height: $navbar-height;
  text-align: center;
  background-color: $menu-bg;

  &:hover {
    .sidebar-logo-link {
      color: $menu-color--active;
    }
  }

  .sidebar-logo-link {
    width: 100%;
    height: 100%;
    color: $menu-color;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      margin-right: 12px;
      vertical-align: middle;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      line-height: 50px;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0;
    }
  }
}
</style>

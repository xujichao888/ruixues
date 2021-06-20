<template>
  <template v-if="isMenuShow">
    <menu-item-link
      v-if="theOnlyOneChild && theOnlyOneChild.meta"
      :to="resolvePath(theOnlyOneChild)"
      :target="theOnlyOneChild.meta.target"
      :class="{ 'is-collapse': isCollapse }"
    >
      <el-menu-item
        v-if="theOnlyOneChild && !theOnlyOneChild.children"
        :index="resolvePath(theOnlyOneChild)"
        :class="{ 'submenu-title-no-dropdown': isFirstLevel }"
      >
        <i :class="['menu-icon', theOnlyOneChild.meta.icon]"></i>
        <template #title>
          <el-badge v-bind="badge">
            <span>{{ theOnlyOneChild.meta.title }}</span>
          </el-badge>
        </template>
      </el-menu-item>
    </menu-item-link>
    <el-submenu
      v-else
      :index="resolvePath(route)"
      popper-append-to-body
      :class="{ 'is-collapse': isCollapse }"
    >
      <template #title>
        <el-badge v-bind="badge" v-if="route.meta">
          <i :class="['menu-icon', route.meta.icon]"></i>
          <span>{{ route.meta.title }}</span>
        </el-badge>
      </template>
      <template v-if="route.children">
        <menu-item
          v-for="child in route.children"
          :key="child.path"
          :route="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child)"
          class="nest-menu"
        />
      </template>
    </el-submenu>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { isExternal } from '@/utils/is'
import MenuItemLink from './menu-link.vue'
import { RouteRecordRaw } from 'vue-router'
import { useAPPStore } from '@/store/modules/app'
import { resolvePath as pathResolve } from '@/utils'

export default defineComponent({
  name: 'MenuItem',
  components: {
    MenuItemLink,
  },
  props: {
    route: {
      type: Object as PropType<RouteRecordRaw>,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
    isCollapse: {
      type: Boolean,
      default: false,
    },
    isFirstLevel: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const APPSotre = useAPPStore()

    const theOnlyOneChild = computed(() => {
      return getOnlyOneChild(props.route)
    })

    const isMenuShow = computed(() => {
      const only = theOnlyOneChild.value
      return !props.route.meta?.hideMenu && (!only?.children || only.children.length)
    })

    // If there has children and no redirect,
    // regarded as non-routable
    const isExpansionRoutable = computed(() => {
      return props.route?.children?.length && props.route.redirect
    })

    const badge = computed(() => {
      const { meta } = theOnlyOneChild.value || props.route
      const badge = meta?.badge || { hidden: true }
      if (!badge.type) {
        badge.type = 'danger'
      }
      return badge
    })

    function resolvePath(route: RouteRecordRaw) {
      const routePath = route.meta?.href || route.path
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(props.basePath)) {
        return props.basePath
      }
      return pathResolve(props.basePath, routePath)
    }

    let menuInited = false
    const opened = computed(() => {
      // To prevent the current menu closed automatically when switching menu
      if (menuInited) return true
      if (props.route.path === '*') return false
      menuInited =
        props.route.path === '/'
          ? APPSotre.currentActiveMenu === props.route.path
          : Boolean(new RegExp(`^${props.route.path}`).exec(APPSotre.currentActiveMenu))
      return menuInited
    })

    function calcShowChildNumber(_route: RouteRecordRaw) {
      if (_route.meta?.hideChildrenInMenu) {
        return 0
      }
      if (_route.children) {
        const showingChildren = _route.children.filter((item) => {
          if (!item.meta || item.meta.hideMenu) {
            return false
          } else {
            return true
          }
        })
        return showingChildren.length
      }
      return 0
    }

    function getOnlyOneChild(
      _route: RouteRecordRaw,
      isPropagation?: boolean
    ): null | RouteRecordRaw {
      if (calcShowChildNumber(_route) > 1) {
        return null
      }
      if (_route.children) {
        if (calcShowChildNumber(_route) > 0) {
          for (const child of _route.children) {
            if (!child.meta || !child.meta.hideMenu) {
              const onlyChild = getOnlyOneChild(child, true)
              let resChild = child
              if (onlyChild) {
                resChild = onlyChild
              }
              if (calcShowChildNumber(resChild) === 0) {
                resChild.children = undefined
              }
              return resChild
            }
          }
        } else {
          _route.children = undefined
        }
      }
      // If propagate the child as parent route,
      // the basePath is not conatins item's path information
      if (isPropagation) {
        return _route
      }
      // If there is no children, return itself with path removed,
      // because this.basePath already conatins item's path information
      return { ..._route, path: '' }
    }

    return {
      theOnlyOneChild,
      resolvePath,
      opened,
      isExpansionRoutable,
      isMenuShow,
      badge,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-menu-item {
  height: $navbar-height;
  line-height: $navbar-height;
  color: $menu-color;

  ::v-deep(.menu-link) {
    color: inherit;
  }

  &.is-active,
  &:hover {
    color: $menu-color--active !important;
  }

  &:hover {
    background: none !important;
  }

  &.is-active {
    background-color: $menu-bg--active !important;
  }
}

.el-submenu {
  ::v-deep(.el-submenu__title) {
    height: $navbar-height;
    line-height: $navbar-height;
    color: $menu-color;

    i {
      color: inherit;
    }

    &:hover {
      color: $menu-color--active !important;
      background: none !important;
    }
  }

  ::v-deep(.el-submenu__icon-arrow) {
    margin-top: -3px;
  }
}

.menu-icon {
  display: inline-block;
  margin-right: 6px;
  font-size: 14px;
  color: inherit;
  text-align: center;
  vertical-align: middle;
}

.is-collapse:not(.nest-menu) {
  .menu-icon {
    margin-right: 0;
  }

  ::v-deep(.el-submenu__title),
  .el-menu-item {
    text-align: center;
  }
}

.el-badge {
  width: 100%;

  &::v-deep(.el-badge__content) {
    top: 18px;
    right: 12px;
    transform: none;

    &.is-dot {
      top: 22px;
      right: 20px;
    }
  }
}
</style>

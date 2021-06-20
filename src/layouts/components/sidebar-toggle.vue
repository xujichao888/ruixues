<template>
  <el-button
    class="sidebar-toggle"
    :icon="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
    type="text"
    @click="toggle"
  />
</template>

<script lang="ts">
import { useAPPStore } from '@/store/modules/app'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'SidebarToggle',
  setup() {
    const APPStore = useAPPStore()
    const isCollapse = computed(() => !APPStore.sidebarOpened)
    const toggle = () => APPStore.toggleSidebar()

    return {
      isCollapse,
      toggle,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-button {
  font-size: 18px;
  color: $--color-text-regular;
}
</style>

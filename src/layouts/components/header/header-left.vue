<template>
  <section class="layout-header-left">
    <sidebar-toggle />
    <breadcrumb />
  </section>
</template>
<script>
import { defineComponent } from 'vue'
import Breadcrumb from '@/layouts/components/breadcrumb.vue'
import SidebarToggle from '@/layouts/components/sidebar-toggle.vue'

export default defineComponent({
  name: 'HeaderLeft',
  components: {
    Breadcrumb,
    SidebarToggle,
  },
})
</script>

<style lang="scss" scoped>
.layout-header-left {
  display: flex;
  align-items: center;
}

.sidebar-toggle {
  margin-right: 10px;
}
</style>

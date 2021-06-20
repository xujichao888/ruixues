<template>
  <el-header :height="`${height}px`">
    <header-left />
    <header-right />
  </el-header>
</template>

<script lang="ts">
import { useAPPStore } from '@/store/modules/app'
import { defineComponent } from 'vue'
import HeaderLeft from './header-left.vue'
import HeaderRight from './header-right.vue'

export default defineComponent({
  name: 'LayoutHeader',
  components: {
    HeaderLeft,
    HeaderRight,
  },
  setup() {
    const APPStore = useAPPStore()

    return {
      height: APPStore.navbarHeight,
    }
  },
})
</script>

<style lang="scss" scoped>
.el-header {
  z-index: 2000;
  display: flex;
  width: 100%;
  line-height: 50px;
  color: $--color-text-regular;
  background-color: $navbar-bg;
  border-bottom: 1px solid $--card-border-color;
  align-items: center;
  justify-content: space-between;
}
</style>

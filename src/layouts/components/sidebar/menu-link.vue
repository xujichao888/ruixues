<template>
  <a class="menu-link" v-if="isExternal(to)" :href="to" :target="target" rel="noopener">
    <slot></slot>
  </a>
  <router-link class="menu-link" v-else :to="to" :target="target">
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { isExternal } from '@/utils/is'

export default defineComponent({
  name: 'MenuItemLink',
  props: {
    to: {
      type: String,
      required: true,
    },
    target: String,
  },
  setup() {
    return {
      isExternal,
    }
  },
})
</script>

<style lang="scss" scoped>
.menu-link {
  text-decoration: none;
}
</style>

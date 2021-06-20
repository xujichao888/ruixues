
<template>
  <i :class="item.class"></i>
</template>

<script lang="ts">
export default {
  name: 'zxIcon',
  props: {
    item: { type: Object, default: {} },
    formData: {},
  },
  setup() {},
}
</script>

<style scoped>
</style>

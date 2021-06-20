<template>
  <div>
    <h1>{{ message }}</h1>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Dashboard',
  setup() {
    return {
      message: 'Dashboard',
    }
  },
})
</script>

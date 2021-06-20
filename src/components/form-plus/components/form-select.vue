<template>
  <el-select>
    <el-option v-for="item in options" :key="item.value" v-bind="item" />
  </el-select>
</template>
<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'FormSelect',
  props: {
    options: {
      type: Array as PropType<SelectOption[]>,
      default: () => [],
    },
  },
})
</script>

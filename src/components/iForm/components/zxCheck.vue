
<template>
  <el-checkbox-group v-model="formData[item.prop]" :min="item.min" :max="item.max">
    <el-checkbox
      v-for="option in options"
      :key="option.value ? option.value : option"
      :label="option.value ? option.value : option"
      :disabled="item.disabled"
      :style="item.style"
      @change="change"
    >
      {{ option.label ? option.label : option }}
    </el-checkbox>
  </el-checkbox-group>
</template>

<script lang="ts">
import { computed, onBeforeMount } from 'vue'

export default {
  name: 'zxCheck',
  emits: ['event'],
  props: {
    item: { type: Object, default: {} },
    formData: {},
  },
  setup(prop, context) {
    onBeforeMount(() => {
      let arr = prop.formData as any[]
      if (!arr[prop.item.prop]) {
        arr[prop.item.prop] = []
      }
    })
    const change = () => {
      context.emit('event', {
        type: 'change',
        prop: prop.item.prop,
        value: (prop.formData as any[])[prop.item.prop],
      })
    }
    const options = computed(() => {
      if (prop.item.options instanceof Array) {
        return prop.item.options
      } else {
        let list = prop.item.options.split(',')
        return list.map((item: any) => {
          return { value: item, label: item }
        })
      }
    })
    return {
      options,
      change,
    }
  },
}
</script>

<style scoped>
</style>

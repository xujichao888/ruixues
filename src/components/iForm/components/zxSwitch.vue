
<template>
  <el-switch
    v-model="formData[item.prop]"
    :width="item.width"
    :active-color="item.activeColor"
    :inactive-color="item.inactiveColor"
    :active-value="item.activeValue"
    :inactive-value="item.inactiveValue"
    :active-text="item.activeText"
    :inactive-text="item.inactiveText"
    :disabled="item.disabled"
    :style="item.style"
    @change="change"
  >
  </el-switch>
</template>

<script lang="ts">
export default {
  name: 'zxSwitch',
  emits: ['event'],
  props: {
    item: { type: Object, default: {} },
    formData: {},
  },
  setup(prop, context) {
    const change = () => {
      context.emit('event', {
        type: 'change',
        prop: prop.item.prop,
        value: (prop.formData as any[])[prop.item.prop],
      })
    }
    return {
      change,
    }
  },
}
</script>

<style scoped>
</style>

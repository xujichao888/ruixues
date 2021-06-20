<template>
  <el-form-item :label="hideLabel ? undefined : schema.label" :prop="schema.prop">
    <component
      v-if="schema.prop"
      :is="component"
      :placeholder="schema.autoSetPlaceHolder !== false && schema.label"
      v-bind="{ ...$attrs, ...schema.componentProps }"
      :model-value="modelValue"
      @update:model-value="$emit('update:model-value', $event)"
      v-on="schema.on || {}"
    />
  </el-form-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { TableColumn } from '@/components/table-plus'
import componentMap from '../componentMap'

export default defineComponent({
  name: 'FormItem',
  props: {
    schema: {
      type: Object as PropType<TableColumn>,
      required: true,
    },
    hideLabel: Boolean,
    modelValue: {
      //
    },
  },
  emits: ['update:model-value'],
  setup(props) {
    const component = componentMap.get(props.schema.component as never)

    return {
      component,
    }
  },
})
</script>

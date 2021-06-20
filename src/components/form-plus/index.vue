<template>
  <el-form ref="formRef" :model="formModel" :rules="rules">
    <el-row :gutter="gutter" type="flex">
      <slot name="prepend" :model="formModel" :col-props="baseColProps"></slot>
      <template v-for="(field, index) in fields">
        <el-col
          v-if="!advanceIndex || index <= advanceIndex"
          :key="field.prop"
          v-bind="{ ...baseColProps, ...field.colProps }"
        >
          <form-item
            v-if="field.prop"
            :schema="field"
            v-model="formModel[field.prop]"
            :hide-label="hideLabel"
          />
        </el-col>
      </template>
      <slot name="append" :model="formModel" :col-props="baseColProps"></slot>
      <el-col v-bind="baseColProps">
        <el-form-item>
          <el-button @click="reset" :loading="loading">重置</el-button>
          <el-button type="primary" :loading="loading" @click="submit">查询</el-button>
          <el-button
            v-if="advanceIndex"
            type="text"
            :icon="isExpand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
            @click="isExpand = !isExpand"
          >
            {{ isExpand ? '收起' : '展开' }}
          </el-button>
        </el-form-item>
      </el-col>
      <slot name="after" :model="formModel" :col-props="baseColProps"></slot>
    </el-row>
  </el-form>
</template>

<script lang="ts">
import { computed, defineComponent, ref, unref } from 'vue'
import { ElForm } from 'element-plus'
import FormItem from './components/form-item.vue'
import { TableColumn } from '@/components/table-plus'
import type { ColProps } from './types'
import useChildrenExpose from '@/hooks/use-children-expose'
import { formatFieldsValue, initFormModel } from './utils'
import { useScreens } from '@/hooks/setting/screens'

export default defineComponent({
  name: 'FormPlus',
  components: {
    FormItem,
  },
  props: {
    fields: {
      type: Array as PropType<TableColumn[]>,
      default: () => [],
    },
    rules: {
      type: Object,
      default: null,
    },
    gutter: {
      type: Number,
      default: 0,
    },
    baseColProps: {
      type: Object as PropType<ColProps>,
      default: () =>
        ({
          xl: 4,
          lg: 6,
          md: 8,
          sm: 12,
          xs: 24,
        } as ColProps),
    },
    loading: Boolean,
    hideLabel: Boolean,
    advanceLines: {
      type: Number,
      default: 1,
    },
  },
  emits: ['submit', 'reset'],
  setup(props, { emit, expose }) {
    const formRef = ref<InstanceType<typeof ElForm>>()
    const formModel = ref(initFormModel(props.fields))
    const isExpand = ref(false)
    const { getCol } = useScreens()
    const advanceIndex = computed(() => {
      const { fields, advanceLines, baseColProps } = props
      if (isExpand.value) return Infinity
      const cols = [baseColProps].concat(fields.map((item) => item.colProps || baseColProps))
      let sumCols = 0
      for (let index = 0; index < cols.length; index++) {
        const col = cols[index]
        sumCols += getCol(col)
        if (sumCols >= advanceLines * 24) {
          return index - 1
        }
      }
      // don't show advance button
      return 0
    })

    function validate() {
      return unref(formRef)?.validate()
    }

    async function submit() {
      try {
        await validate()
        emit('submit', getFieldsValue())
      } catch (error) {
        //
      }
    }

    async function reset() {
      try {
        formRef.value?.resetFields()
        await validate()
        emit('submit', getFieldsValue())
      } catch (error) {
        //
      }
    }

    function getFieldsValue() {
      return formatFieldsValue(formModel, props.fields)
    }

    function updateFieldValueByKey<T>(field: string, value: T) {
      formModel.value[field] = value
    }

    function updateFieldsValue<T>(model: T) {
      formModel.value = {
        ...formModel.value,
        ...model,
      }
    }

    useChildrenExpose({
      expose,
      children: [
        {
          methods: ['validate', 'clearValidate', 'resetFields', 'validateField'],
          component: formRef,
        },
      ],
      methods: {
        getFieldsValue,
        updateFieldValueByKey,
        updateFieldsValue,
      },
    })

    return {
      formRef,
      submit,
      reset,
      formModel,
      isExpand,
      advanceIndex,
    }
  },
})
</script>

<style lang="scss" scoped>
::v-deep(.el-date-editor) {
  &.el-input,
  &.el-input__inner {
    width: 208px;
  }
}
</style>

<template>
  <el-table-column
    v-if="!rebuildColunm.hideInTable"
    :key="rebuildColunm.prop"
    v-bind="rebuildColunm"
  >
    <!-- multiple header -->
    <template v-if="column.children" #default="{ row, $index: index }">
      <table-column
        v-for="child in column.children"
        :key="child.prop"
        v-bind="{ ...$attrs, row, index, actionColumnKey, editRows }"
        :column="child"
        @row-change="onRowChange"
      />
    </template>
    <!-- body cell slot -->
    <template
      v-else-if="!(column.type && ['index', 'selection', 'expand'].includes(column.type))"
      #default="{ row, column: col, $index }"
    >
      <template v-if="editRows[$index] && column.prop !== actionColumnKey">
        <el-form
          v-if="column.component && !column.hideOnEdit"
          :model="editRows[$index]"
          :rules="$attrs.rules"
          @submit.prevent
        >
          <form-item
            v-if="column.prop"
            :schema="column"
            :model-value="editRows[$index][column.prop]"
            hide-label
            size="mini"
            @update:model-value="(value) => column.prop && onRowChange(column.prop, value, $index)"
          />
        </el-form>
        <template v-else>
          {{ getFormatterValue(col, row, $index) }}
        </template>
      </template>
      <slot
        v-else-if="bodyCellSlots[rebuildColunm.prop]"
        :name="`${SlotsPrefix.BODY_CELL}${rebuildColunm.prop}`"
        v-bind="{ row, col, $index }"
        :index="$index"
      ></slot>
      <template v-else>
        {{ getFormatterValue(col, row, $index) }}
      </template>
    </template>

    <!-- header cell slot -->
    <template v-if="headerCellSlots[rebuildColunm.prop]" #header="props">
      <slot
        :name="`${SlotsPrefix.HEADER_CELL}${rebuildColunm.prop}`"
        v-bind="props"
        :index="props.$index"
      ></slot>
    </template>
    <!-- header cell with tooltip -->
    <template v-else-if="rebuildColunm.tooltip && !rebuildColunm.renderHeader" #header>
      <el-tooltip placement="bottom">
        <span>
          {{ rebuildColunm.label }}
          <i class="el-icon-question"></i>
        </span>
        <template #content>
          {{ rebuildColunm.tooltip }}
        </template>
      </el-tooltip>
    </template>
  </el-table-column>
</template>

<script lang="ts">
import { isFunction } from 'lodash'
import { computed, defineComponent } from 'vue'
import { SlotsPrefix } from './constant'
import { getSlotsByKey } from './utils'
import type { TableColumn } from './types'
import FormItem from '@/components/form-plus/components/form-item.vue'

export default defineComponent({
  name: 'TableColumn',
  components: {
    FormItem,
  },
  props: {
    column: {
      type: Object as PropType<TableColumn>,
      default: () => ({}),
    },
    actionColumnKey: String,
    editRows: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['row-change'],
  setup(props, { slots, emit }) {
    const bodyCellSlots = computed(() => getSlotsByKey(slots, SlotsPrefix.BODY_CELL))
    const headerCellSlots = computed(() => getSlotsByKey(slots, SlotsPrefix.HEADER_CELL))
    const rebuildColunm = computed(() => {
      // remove children for avoid element-plus warning
      const { children: _, ...column } = props.column
      const { formatter, renderHeader } = props.column
      // Currying renderHeader with column
      if (renderHeader) {
        // eslint-disable-next-line vue/no-mutating-props
        column.renderHeader = (data) =>
          renderHeader({
            ...data,
            column: {
              ...props.column,
              ...data.column,
            },
          })
      }

      // Currying formatter with column
      if (formatter) {
        column.formatter = (...args) => {
          args[1] = {
            ...props.column,
            ...args[1],
          }
          return formatter(...args)
        }
      }

      return {
        ...column,
        prop: column.prop || column.type!,
      }
    })

    function getFormatterValue(column: TableColumn, row: Recordable, index: number) {
      const { formatter, property: prop } = column
      const value = row[prop!]
      if (!isFunction(formatter)) return value
      const result = formatter(row, column, value, index)
      if (result && result.__v_isVNode) {
        return result.children
      }
      return result
    }

    function onRowChange(field: string, value: any, index: number) {
      emit('row-change', field, value, index)
    }

    return {
      rebuildColunm,
      bodyCellSlots,
      headerCellSlots,
      SlotsPrefix,
      getFormatterValue,
      onRowChange,
    }
  },
})
</script>

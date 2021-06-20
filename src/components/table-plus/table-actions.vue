<template>
  <div :class="[alignClass]" class="flex items-center flex-nowrap">
    <slot v-bind="{ row, column, index }">
      <template v-if="rowEditable">
        <template v-if="editRows[index]">
          <el-button
            type="text"
            size="mini"
            :loading="saveStatus.loading"
            @click="$emit('save', row, index, saveStatus, fields)"
          >
            保存
          </el-button>
          <el-button type="text" size="mini" @click="$emit('cancel', row, index)">取消</el-button>
        </template>
        <template v-else-if="row._uneditable"> - </template>
        <el-button v-else type="text" size="mini" @click="$emit('edit', row, index)">
          编辑
        </el-button>
      </template>
    </slot>
    <template v-if="!editRows[index]">
      <template v-for="act in rebuildActions">
        <action-confirm
          v-if="!act.hide"
          :key="act.label"
          size="mini"
          :action="act"
          type="text"
          :row="row"
          @confirm="(act) => act.onClick && act.onClick(row, act, index, rebuildActions)"
        />
      </template>
      <slot name="append" v-bind="{ row, column, index }"></slot>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { TableAction, TableColumn } from './types'
import ActionConfirm from './components/action-confirm.vue'
import { getActionButton } from './utils'

export default defineComponent({
  name: 'TableActions',
  components: {
    ActionConfirm,
  },
  props: {
    rowEditable: Boolean,
    row: {
      type: Object as PropType<Recordable>,
      required: true,
    },
    column: {
      type: Object as PropType<TableColumn>,
      required: true,
    },
    fields: {
      type: Array as PropType<TableColumn[]>,
      required: true,
    },
    actions: {
      type: Array as PropType<TableAction[]>,
      default: () => [],
    },
    index: {
      type: Number,
      default: -1,
    },
    editRows: {
      type: Object as PropType<Recordable>,
      default: () => ({} as Recordable),
    },
  },
  emits: ['edit', 'save', 'cancel'],
  setup(props) {
    const alignClass = computed(() => {
      const prefix = 'justify-'
      const column = props.column
      return (
        prefix +
        (column?.align === 'right' ? 'end' : column?.align === 'center' ? 'center' : 'left')
      )
    })
    const rebuildActions = ref<TableAction[]>([])
    const saveStatus = ref({
      loading: false,
    })

    watch(
      () => [props.actions, props.row],
      ([acts, row]: [TableAction[], Recordable]) => {
        rebuildActions.value = acts.map((act) => getActionButton(act, row))
      },
      { immediate: true, deep: true }
    )

    return {
      alignClass,
      rebuildActions,
      saveStatus,
    }
  },
})
</script>

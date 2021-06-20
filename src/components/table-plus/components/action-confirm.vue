<script lang="tsx">
import { computed, defineComponent } from 'vue'
import type { TableAction } from '../types'

export default defineComponent({
  name: 'ActionPopconfirm',
  props: {
    action: {
      type: Object as PropType<TableAction>,
      default: () => ({} as TableAction),
    },
    size: String,
    type: String,
    row: {
      type: Object as PropType<Recordable>,
      default: () => ({}),
    },
  },
  emits: ['confirm'],
  setup(props, { emit, attrs }) {
    const options = computed(() => {
      const { onClick: _, ...rest } = {
        ...props.action,
        ...attrs,
        type: props.type,
        size: props.size,
      }
      return rest
    })

    const actionButton = () => (
      <el-button
        {...options}
        type={options.value.type}
        size={options.value.size || 'mini'}
        icon={options.value.icon}
        loading={options.value.loading}
        onClick={options.value.confirm ? undefined : () => onConfirm()}
      >
        {options.value.label}
      </el-button>
    )

    function onConfirm() {
      emit('confirm', props.action)
    }

    if (!props.action.confirm) {
      return actionButton
    }
    return () => (
      <el-popconfirm title={`确定${options.value.label}吗？`} onConfirm={() => onConfirm()}>
        {{
          reference: actionButton,
        }}
      </el-popconfirm>
    )
  },
})
</script>

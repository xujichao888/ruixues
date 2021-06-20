<script lang="tsx">
import { defineComponent } from 'vue'
import type { ComponentOptionsWithObjectProps } from 'vue'

const options = {
  type: Array as PropType<SelectOption[]>,
  default: () => [],
}

const definedOptions: ComponentOptionsWithObjectProps = {
  name: 'RadioGroup',
  props: {
    options,
  },
  setup(props) {
    console.log(props)
    return () => (
      <el-radio-group>
        {(props.options as SelectOption[]).map((opt) => {
          if (props.isButton) {
            return (
              <el-radio-button {...opt} label={opt.value}>
                {opt.label}
              </el-radio-button>
            )
          }
          return (
            <el-radio {...opt} label={opt.value}>
              {opt.label}
            </el-radio>
          )
        })}
      </el-radio-group>
    )
  },
}

const radioGroup = defineComponent(definedOptions)

radioGroup.Button = defineComponent(
  Object.assign({}, definedOptions, {
    props: {
      options,
      isButton: {
        type: Boolean,
        default: true,
      },
    },
  })
)

export default radioGroup
</script>

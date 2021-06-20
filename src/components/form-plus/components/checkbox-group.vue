<script lang="tsx">
import { defineComponent } from 'vue'
import type { ComponentOptionsWithObjectProps } from 'vue'

const options = {
  type: Array as PropType<SelectOption[]>,
  default: () => [],
}

const definedOptions: ComponentOptionsWithObjectProps = {
  name: 'CheckboxGroup',
  props: {
    options,
  },
  setup(props) {
    return () => (
      <el-checkbox-group>
        {(props.options as SelectOption[]).map((opt) => {
          if (props.isButton) {
            return <el-checkbox-button {...opt} />
          }
          return <el-checkbox {...opt} />
        })}
      </el-checkbox-group>
    )
  },
}

const checkboxGroup = defineComponent(definedOptions)

checkboxGroup.Button = defineComponent(
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

export default checkboxGroup
</script>

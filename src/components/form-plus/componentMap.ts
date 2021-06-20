import {
  ElAutocomplete,
  ElCascader,
  ElCheckbox,
  ElColorPicker,
  ElDatePicker,
  ElInput,
  ElInputNumber,
  ElRate,
  ElSlider,
  ElSwitch,
  ElTimePicker,
  ElTransfer,
  ElTree,
  ElUpload,
} from 'element-plus'
import { Component } from 'vue'
import { ComponentType } from './types'
import FormSelect from './components/form-select.vue'
import RadioGroup from './components/radio-group.vue'
import CheckboxGroup from './components/checkbox-group.vue'

export const componentMap = new Map<ComponentType, Component>()

add('Input', ElInput)
add('Select', FormSelect)
add('RemoteSelect', FormSelect)
add('DatePicker', ElDatePicker)
add('TimePicker', ElTimePicker)
add('DateTimePicker', ElDatePicker)
add('TreeSelect', ElTree)
add('Transfer', ElTransfer)
add('RadioGroup', RadioGroup)
add('RadioButtonGroup', RadioGroup.Button)
add('Checkbox', ElCheckbox)
add('CheckboxGroup', CheckboxGroup)
add('CheckboxButtonGroup', CheckboxGroup.Button)
add('AutoComplete', ElAutocomplete)
add('Cascader', ElCascader)
add('Slider', ElSlider)
add('RangePicker', ElSlider)
add('Switch', ElSwitch)
add('Upload', ElUpload)
add('Rate', ElRate)
add('ColorPicker', ElColorPicker)
add('InputNumber', ElInputNumber)

export function add(compName: ComponentType, component: Component) {
  componentMap.set(compName, component)
}

export function del(compName: ComponentType) {
  componentMap.delete(compName)
}

function get(compName?: ComponentType) {
  return (compName && componentMap.get(compName)) || compName
}

export default {
  add,
  del,
  get,
}

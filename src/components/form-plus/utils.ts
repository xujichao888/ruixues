import { Ref, unref } from 'vue'
import { isNullOrUnDef } from '@/utils/is'
import { TableColumn } from '../table-plus'
import dayjs from 'dayjs'

export function initFormModel(fields: TableColumn[]) {
  const model: Recordable = {}
  fields.forEach((field) => {
    const { defaultValue, prop } = field
    if (!isNullOrUnDef(defaultValue)) {
      model[prop!] = defaultValue
    }
  })

  return model
}

export function formatFieldsValue(formModel: Ref<Recordable> | Recordable, fields: TableColumn[]) {
  const model = {
    ...unref(formModel),
  }
  fields.forEach((field) => {
    const { prop, splitToFields } = field
    if (splitToFields && prop) {
      const [[start, end], format] = splitToFields
      const value = unref(model[prop])
      if (!start || !end || !Array.isArray(value)) {
        return
      }
      delete model[prop]
      value.forEach((val, index) => {
        model[[start, end][index]] = format ? dayjs(val).format(format) : val
      })
    }
  })
  return model
}

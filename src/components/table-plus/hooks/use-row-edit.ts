import type { Ref } from 'vue'
import { cloneDeep } from 'lodash'
import { ElMessage } from 'element-plus'
import { formatFieldsValue } from '@/components/form-plus/utils'
import { TableColumn } from '../types'

interface Props {
  dataSource: Ref<Recordable[]>
  editRows: Ref<Recordable>
  emit: EmitType
}

export default function ({ dataSource, editRows, emit }: Props) {
  function handleRowEdit(row: Recordable, index: number) {
    editRows.value[index] = cloneDeep(row)
  }

  function handleRowSave(
    row: Recordable,
    index: number,
    status: { loading: boolean },
    fields: TableColumn[]
  ) {
    status.loading = true
    const edited = {
      ...row,
      ...formatFieldsValue(editRows.value[index], fields),
    }
    emit('row-save', edited, index, (error?: Error) => {
      status.loading = false
      if (error) {
        ElMessage.error(error.message)
      }
      Object.assign(row, edited)
      handleRowCancel(row, index, error)
    })
  }

  function handleRowCancel(row: Recordable, index: number, error?: Error) {
    if (error) return
    delete editRows.value[index]
    if (!row.id) {
      delete dataSource.value[index]
    }
  }

  return {
    handleRowEdit,
    handleRowSave,
    handleRowCancel,
  }
}

import { cloneDeep, isFunction, isUndefined } from 'lodash'
import type { Slot, TableAction } from './types'

export function getSlotsByKey(slots: Slot, slotKey: string) {
  const result: Slot = {}
  for (const key in slots) {
    if (Object.prototype.hasOwnProperty.call(slots, key) && key.includes(slotKey)) {
      result[key.replace(slotKey, '')] = slots[key]
    }
  }
  return result
}

export function getActionButton(atc: TableAction, row?: Recordable) {
  const actClone = cloneDeep(atc)
  const { label, disabled, hide } = actClone
  if (row) {
    if (isFunction(label)) {
      actClone.label = label(row, actClone)
    }
    if (isFunction(disabled)) {
      actClone.disabled = disabled(row, actClone)
    }
    if (isFunction(hide)) {
      actClone.hide = hide(row, actClone)
    }
  }
  if (isUndefined(actClone.loading)) actClone.loading = false
  return actClone
}

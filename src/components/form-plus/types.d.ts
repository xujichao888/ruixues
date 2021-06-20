import { Component } from 'vue'
import type { RuleItem } from 'async-validator'

export interface FormItemSchema {
  defaultValue?: any
  component?: ComponentType | Component
  componentProps?: Recordable
  colProps?: ColProps
  rules?: RuleItem[]
  searchRules?: RuleItem[]
  editRules?: RuleItem[]
  on?: Recordable<Function>
  splitToFields?: [string[], string?]
  autoSetPlaceHolder?: boolean
}

export interface ColObject {
  span?: number
  offset?: number
}

export interface ColProps {
  tag?: string
  span?: number
  offset?: number
  pull?: number
  push?: number
  xs?: number | ColObject
  sm?: number | ColObject
  md?: number | ColObject
  lg?: number | ColObject
  xl?: number | ColObject
}

export interface FormPlusExpose {
  validate: () => Promise<boolean>
  clearValidate: () => Promise<void>
  resetFields: () => Promise<void>
  validateField: () => Promise<void>
  getFieldsValue: () => Recordable
  updateFieldValueByKey: (field: string, value: any) => void
  updateFieldsValue: (model: Recordable) => void
}

export type ComponentType =
  | 'Input'
  | 'Select'
  | 'RemoteSelect'
  | 'TreeSelect'
  | 'Transfer'
  | 'RadioButtonGroup'
  | 'RadioGroup'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'CheckboxButtonGroup'
  | 'AutoComplete'
  | 'Cascader'
  | 'DatePicker'
  | 'TimePicker'
  | 'DateTimePicker'
  // | 'MonthPicker'
  | 'RangePicker'
  // | 'WeekPicker'
  | 'Switch'
  | 'Rate'
  | 'Upload'
  | 'ColorPicker'
  | 'Slider'
  | 'InputNumber'

interface SelectOption {
  value: any
  label: string | number
  disabled?: boolean
  children?: SelectOption[]
}

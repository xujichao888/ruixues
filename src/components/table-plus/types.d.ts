import type { Slot as VueSlot } from 'vue'
import type { TableColumnCtx, CI } from 'element-plus/lib/el-table/src/table-column/defaults'
import type { TableProps as ElTableProps } from 'element-plus/lib/el-table/src/table/defaults'
import type ElTable from 'element-plus/lib/el-table/src/table.vue'
import type { FormItemSchema } from '@/components/form-plus/types'

declare type CI<T> = {
  column: TableColumn<T>
  $index: number
}

export type Slot = Recordable<VueSlot | undefined>

export interface TableAction<T = Recordable> {
  id?: number
  label: string | ((row: Recordable, atc: TableAction) => string)
  disabled?: boolean | ((row: Recordable, atc: TableAction) => boolean)
  hide?: boolean | ((row: Recordable, atc: TableAction) => boolean)
  icon?: string
  type?: string
  size?: string
  onClick?: (selection: T | T[], atc: TableAction, index?: number) => any
  loading?: boolean
  confirm?: boolean
}

export interface TableProps<T = Recordable> extends ElTableProps<T> {
  actions: any[]
}

export interface TableColumn<T = Recordable> extends Partial<TableColumnCtx<T>>, FormItemSchema {
  prop?: keyof T | string
  property?: keyof T | string
  children?: TableColumn<T>[]
  editable?: boolean
  tooltip?: string
  renderHeader?: (data: CI<T>) => VNode | string | number
  formatter?: (
    row: T,
    column: TableColumn<T>,
    cellValue: any,
    index: number
  ) => VNode | string | number
  useInSearchForm?: boolean
  hideInTable?: boolean
  hideOnEdit?: boolean
}

export interface PageField {
  pageField: string
  sizeField: string
  listField: string
  totalField: string
}

export interface Pagination {
  pageSize?: number
  total?: number
  pagerCount?: number
  currentPage?: number
  layout?: string
  pageSizes?: number[]
}

export interface FetchParams {
  page?: number
  searchData?: Recordable
}

export type ElTableExpose = Pick<
  InstanceType<ElTable>,
  | 'clearSelection'
  | 'toggleRowSelection'
  | 'toggleAllSelection'
  | 'toggleRowExpansion'
  | 'setCurrentRow'
  | 'clearSort'
  | 'clearFilter'
  | 'doLayout'
  | 'sort'
>

export interface TablePlusExpose extends TablePlusExpose, ElTableExpose {
  reload: (params: FetchParams) => void
  getPaginationInfo: () => Pagination
  addRow: (defaultValue?: Recordable, append?: boolean) => [row: Recordable, index: number]
  editRow: (row: Recordable, index: number) => void
  getRowByIndex: (index: number) => Nullable<Recordable>
  updateRowByIndex: (index: number, row: Recordable) => void
  removeRowByIndex: (index: number) => void
}

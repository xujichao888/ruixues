import { PageField, TableColumn } from './types'

export enum SlotsPrefix {
  BODY_CELL = 'body-cell-',
  HEADER_CELL = 'header-cell-',
}

export const pageFieldDefault: PageField = {
  pageField: 'page',
  sizeField: 'size',
  listField: 'list',
  totalField: 'total',
}

export const actionsColumnDefault: TableColumn = {
  prop: 'edit-column',
  label: '操作',
  minWidth: '100',
  align: 'center',
  fixed: 'right',
}

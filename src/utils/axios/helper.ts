import { ElMessage, ElMessageBox } from 'element-plus'
import { MessageErrorEnum } from '@/enums/messageEnum'
import { ErrorMessageMode, ResponseResult } from './axios'
import { isArray, isDate, isObject } from 'lodash'
import dayjs from 'dayjs'
import { dateFormatEnum } from '@/enums/dateFormatEnum'

export const showErrorMessage = (
  mode: ErrorMessageMode,
  message: string,
  title = MessageErrorEnum.ERROR_TITLE
) => {
  if (mode !== 'none') {
    switch (mode) {
      case 'modal':
        ElMessageBox.alert(message, title as string, {
          type: 'error',
        })
        break
      case 'message':
        ElMessage.error(message)
        break
    }
  }
}

export const buildErrorMessage = (data: ResponseResult, message = MessageErrorEnum.ERROR_SERVER) =>
  `[${data.code || '-'}] ${data.msg || message}`

export function formatRequestDate(params: Recordable, format?: string) {
  for (const key in params) {
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      const value = params[key]
      if (isDate(value)) {
        params[key] = dayjs(value).format(format || dateFormatEnum.FULL)
      } else if (isObject(value) || isArray(value)) {
        formatRequestDate(value)
      }
    }
  }
}

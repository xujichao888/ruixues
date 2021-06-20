import { AxiosError, AxiosResponse } from 'axios'
import { ResponseResult } from './axios'
import { buildErrorMessage, showErrorMessage } from './helper'
import { ResultEnum } from '@/enums/httpEnum'

export function tranformResponseError(error: AxiosError) {
  const response = error.response
  let message = error.message
  const data = response?.data
  if (response) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    message = `${response.statusText}[${response.status}]: `
    if (data) {
      message += buildErrorMessage(data)
    } else {
      message += error.message
    }
  }
  error.message = message

  showErrorMessage('message', message)

  return Promise.reject(error)
}

export function transformResponseHook<T extends ResponseResult>(res: AxiosResponse<T>) {
  const { config, data: resData } = res
  const {
    isReturnNativeResponse = false,
    isTransformRequestResult = true,
    errorMessageMode = 'message',
  } = config

  if (isReturnNativeResponse) {
    return res
  }

  if (!isTransformRequestResult) {
    return resData
  }

  const { code, data } = resData
  if (code === ResultEnum.SUCCESS) {
    return data
  }
  const message = buildErrorMessage(resData)
  showErrorMessage(code === ResultEnum.ERROR ? 'message' : errorMessageMode, message)
  Promise.reject(new Error(message))
}

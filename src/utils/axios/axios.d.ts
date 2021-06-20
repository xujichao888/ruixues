export type ErrorMessageMode = 'none' | 'modal' | 'message' | undefined

export interface ResponseResult<T = any> {
  code: number
  type: 'success' | 'error' | 'warning'
  msg: string
  data: T
}

// multipart/form-data: upload file
export interface UploadFileParams {
  // Other parameters
  data?: Recordable
  // File parameter interface field name
  name?: string
  // file name
  file: File | Blob
  // file name
  filename?: string
  [key: string]: any
}

declare module 'axios' {
  export interface AxiosRequestConfig {
    //  Whether to process the request result
    isTransformRequestResult?: boolean
    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    isReturnNativeResponse?: boolean
    // Whether to join url
    joinPrefix?: boolean
    // Error message prompt type
    errorMessageMode?: ErrorMessageMode
    // format date to string
    formatDate?: boolean | string
  }
}
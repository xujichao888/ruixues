import { RequestEnum } from '@/enums/httpEnum'
import { request } from '@/utils/axios'
import { ResponseResult } from '@/utils/axios/axios'
import axios, { CancelToken, CancelTokenSource } from 'axios'
import { ElUploadRequestOptions } from 'element-plus/lib/el-upload/src/upload.type'
import { isString, sum } from 'lodash'

interface Props {
  request?: string | ((data: FormData, options?: ElUploadRequestOptions) => Promise<ResponseResult>)
  concurrent?: number
}

const CHUNK_SIZE = 1024 * 1024 * 2 // 2M

const upload = (data: FormData, options?: ElUploadRequestOptions & { cancelToken?: CancelToken }) =>
  request({
    url: options?.action || 'global/upload/chunk_file',
    data,
    method: RequestEnum.POST,
    timeout: 50000,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...options?.headers,
    },
    onUploadProgress: options?.onProgress,
    withCredentials: options?.withCredentials,
    cancelToken: options?.cancelToken,
  })

export function useSplitUpload({ request, concurrent = 2 }: Props) {
  if (!request || isString(request)) {
    request = upload
  }

  function uploadRequest(options: ElUploadRequestOptions) {
    const { file } = options
    const canceler: CancelTokenSource[] = []
    let isCanceled = false
    const count = Math.ceil(file.size / CHUNK_SIZE)
    let start = 0
    let end = 0
    const data: FormData[] = []
    const percent: number[] = []
    let counter = 0
    const timestamp = Date.now().toString()
    // slice request
    for (let index = 0; index < count; index++) {
      const formData = new FormData()
      end = start + CHUNK_SIZE
      if (end > file.size) end = file.size
      const chunk = file.slice(start, end)
      formData.append('file', chunk, file.name)
      formData.append('chunkIndex', index.toString())
      formData.append('chunkTotal', count.toString())
      formData.append('fileSize', file.size.toString())
      formData.append('timestamp', timestamp)
      formData.append('position', 'service')
      start = end
      data.push(formData)
    }

    new Promise((resolve, reject) => {
      const doUpload = async () => {
        if (isCanceled) return
        try {
          const results = await Promise.all(
            data.splice(0, concurrent).map((item, index) => {
              const source = axios.CancelToken.source()
              canceler.push(source)
              return (request as Function)(item, {
                ...options,
                onProgress(evt: ProgressEvent<EventTarget>) {
                  if (isCanceled) return
                  const { size } = file
                  percent[index + concurrent * counter] = evt.loaded
                  let total = sum(percent)
                  if (total > size) total = size
                  ;(evt as any).percent = Math.floor((total / size) * 10000) / 100
                  options.onProgress(evt)
                },
                cancelToken: source.token,
              })
            })
          )
          if (!data.length) {
            resolve({
              filename: file.name,
              size: file.size,
              type: file.type,
              path: results[0].path,
            })
          } else {
            counter++
            doUpload()
          }
        } catch (error) {
          reject(error)
        }
      }
      doUpload()
    })

    return {
      abort() {
        isCanceled = true
        canceler.forEach((source) => source.cancel('upload canceled'))
      },
    }
  }

  return {
    uploadRequest,
  }
}

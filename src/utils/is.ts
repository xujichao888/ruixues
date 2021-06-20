import { isNull, isUndefined } from 'lodash'

export const isExternal = (path?: string) => path && /^(https?:|mailto:|tel:)/.test(path)

export const isNullOrUnDef = (value: any) => isUndefined(value) || isNull(value)

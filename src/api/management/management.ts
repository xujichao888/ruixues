import { request } from '@/utils/axios'

interface IPagination {
  page: number
  size: number
  key?: string
}

export const getProductlList = (params: IPagination) =>
  request({
    url: '/product/product-list',
    method: 'get',
    params,
  })
export const getProvinceList = () =>
  request({
    url: '/region/province-list',
    method: 'get',
  })
export const getRegionListbyhttp = () =>
  request({
    url: '/region/obj',
    method: 'get',
  })
export const setProductbyhttp = (data: any) =>
  request({
    url: '/product/product-save',
    method: 'put',
    data,
  })
export const getChannelListbyhttp = (params: any) =>
  request({
    url: '/channel/channel-list',
    method: 'get',
    params,
  })
export const setAppbyhttp = (data: any) =>
  request({
    url: '/app/app-save',
    method: 'PUT',
    data,
  })

import { request } from '@/utils/axios';

interface IPagination {
    page: number
    size: number
}
interface IchangeListPamas extends IPagination {
    channelId?: string
    key?: string
}

export const getChannelList = (params: IchangeListPamas) =>
    request({
        url: 'rd/v1/channel/channel-list',
        method: 'get',
        params
    })
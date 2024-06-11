import { http } from '@/utils/http'

import { ListItem } from './common'

export interface GetListAll {
    page: number,
    pageSize: number,
    userId: number
}

export const getListAll = (data: GetListAll) => {
    return http.get<ListItem[]>('/list/getAll', data)
}
import { useQuery, UseQueryOptions } from 'react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { MeliItem, QuickAnswer } from '../types/types'

import { useAxiosInstance } from './useAxios'

export interface MeliItemsSearchResult {
  status: string
  items: MeliItem[]
}

export const useSearchMLItemQuery = (
  query: string,
  options: UseQueryOptions<AxiosResponse<MeliItemsSearchResult>, AxiosError>
) => {
  const axiosPrivate = useAxiosInstance()
  return useQuery<AxiosResponse<MeliItemsSearchResult>, AxiosError>(
    ['ml-item-search', query],
    () => axiosPrivate.get<MeliItemsSearchResult>(`ml/items/search?q=${query}`),
    {
      ...options
    }
  )
}

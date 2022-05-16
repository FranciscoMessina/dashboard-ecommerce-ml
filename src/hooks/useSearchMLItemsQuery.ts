import { useQuery, UseQueryOptions } from 'react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { MeliItem, QuickAnswer } from '../types/types'

import { useAxiosInstance } from './useAxiosInstance'

export interface MeliItemsSearchResult {
  status: string
  results: MeliItem[]
}

export const useSearchMLItemQuery = (
  query: string,
  options?: UseQueryOptions<AxiosResponse<MeliItemsSearchResult>, AxiosError>
) => {
  const axiosPrivate = useAxiosInstance()
  return useQuery<AxiosResponse<MeliItemsSearchResult>, AxiosError>(
    ['meli-item-search', query],
    () => axiosPrivate.get<MeliItemsSearchResult>(`meli/items/search?q=${query}`),
    {
      ...options
    }
  )
}

import { AxiosError, AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import { MeliItem } from '../types/types'
import { useAxiosInstance } from './useAxiosInstance'

export const useGetMLItemQuery = (
  itemId: string,
  options?: UseQueryOptions<AxiosResponse<MeliItem>, AxiosError>
) => {
  const axiosPrivate = useAxiosInstance()
  return useQuery<AxiosResponse<MeliItem>, AxiosError>(
    ['meli-item', itemId],
    () => axiosPrivate.get<MeliItem>(`meli/items/${itemId}`),
    {
      ...options
    }
  )
}

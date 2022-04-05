import { AxiosError, AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import { MeliItem } from '../types/types'
import { useAxiosInstance } from './useAxios'

export const useGetMLItemQuery = (
  itemId: string,
  options?: UseQueryOptions<AxiosResponse<MeliItem>, AxiosError>
) => {
  const axiosPrivate = useAxiosInstance()
  return useQuery<AxiosResponse<MeliItem>, AxiosError>(
    ['ml-item', itemId],
    () => axiosPrivate.get<MeliItem>(`ml/items/${itemId}`),
    {
      ...options
    }
  )
}

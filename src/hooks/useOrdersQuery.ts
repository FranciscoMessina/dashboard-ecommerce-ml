import { AxiosError, AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import { ApiOrdersResponse } from '../types/types.js'
import { useAxiosInstance } from './useAxiosInstance'

export const useOrdersQuery = (
  options?: UseQueryOptions<AxiosResponse<ApiOrdersResponse>, AxiosError>
) => {
  const axiosPrivate = useAxiosInstance()

  return useQuery<AxiosResponse<ApiOrdersResponse>, AxiosError>(
    'orders',
    () => axiosPrivate.get<ApiOrdersResponse>(`orders`),
    {
      ...options
    }
  )
}

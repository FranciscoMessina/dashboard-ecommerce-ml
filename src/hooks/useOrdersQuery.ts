import { AxiosError, AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import { ApiOrdersResponse } from '../types/types'
import { useAxiosInstance } from './useAxios'

export const useOrdersQuery = (
  options?: UseQueryOptions<AxiosResponse<ApiOrdersResponse>, AxiosError>
) => {
  const axiosPrivate = useAxiosInstance()

  return useQuery<AxiosResponse<ApiOrdersResponse>, AxiosError>(
    'orders',
    () => axiosPrivate.get<ApiOrdersResponse>(`ml/orders`),
    {
      ...options
    }
  )
}

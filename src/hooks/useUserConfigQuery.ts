import { AxiosError, AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import { UserConfig } from '../types/types'
import { useAxiosInstance } from './useAxios'

export const useUserConfigQuery = (
  options?: UseQueryOptions<AxiosResponse<UserConfig>, AxiosError>
) => {
  const axiosPrivate = useAxiosInstance()

  return useQuery<AxiosResponse<UserConfig>, AxiosError>(
    'user-config',
    () => axiosPrivate.get<UserConfig>('/user/config'),
    {
      ...options
    }
  )
}

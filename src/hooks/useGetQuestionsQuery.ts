import { AxiosError, AxiosResponse } from 'axios'
import { useQuery, UseQueryOptions } from 'react-query'
import { MeliQuestionsResponse } from '../types/types'
import { useAxiosInstance } from './useAxios'

export const useGetQuestionsQuery = (
  offset: number = 0,
  options?: UseQueryOptions<AxiosResponse<MeliQuestionsResponse>, AxiosError>
) => {
  const axiosPrivate = useAxiosInstance()

  return useQuery<AxiosResponse<MeliQuestionsResponse>, AxiosError>(
    ['questions', offset],
    () => axiosPrivate.get<MeliQuestionsResponse>(`/meli/questions?offset=${offset}`),
    {
      ...options
    }
  )
}

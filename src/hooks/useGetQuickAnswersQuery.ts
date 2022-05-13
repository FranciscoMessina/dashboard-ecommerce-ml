import { useQuery, UseQueryOptions } from 'react-query'
import { AxiosError, AxiosResponse } from 'axios'
import { QuickAnswer } from '../types/types'
import axios from '../helpers/axios'
import { useAxiosInstance } from './useAxios'

export interface QuickAnswersSearchResult {
  query: string
  results: QuickAnswer[]
  matches: number
  total: number
}

export const useGetQuickAnswersQuery = (
  query?: string,
  options?: UseQueryOptions<AxiosResponse<QuickAnswersSearchResult>, AxiosError>
) => {
  const axiosPrivate = useAxiosInstance()
  return useQuery<AxiosResponse<QuickAnswersSearchResult>, AxiosError>(
    ['quickanswers', query],
    () => axiosPrivate.get<QuickAnswersSearchResult>(`users/quickanswers?q=${query}`),
    {
      ...options
    }
  )
}

import { useMutation, UseMutationOptions, useQueryClient } from 'react-query'
import { useAxiosInstance } from './useAxios'

export const useAnswerQuestion = (options: UseMutationOptions) => {
  const queryClient = useQueryClient()

  const axiosPrivate = useAxiosInstance()

  return useMutation(
    (data: any) => axiosPrivate.post('meli/answers', { answer: data.answer, id: data.id }),
    {
      onMutate: (data: any) => {
        queryClient.invalidateQueries('questions')
      },
      onSuccess: (data) => {
        console.log(data)
        queryClient.invalidateQueries('questions')
      },
      onError: (data) => {},
      ...options
    }
  )
}

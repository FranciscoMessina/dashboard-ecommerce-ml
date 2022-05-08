import { Button, Space, Textarea } from '@mantine/core'
import { ContextModalProps } from '@mantine/modals'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import * as Yup from 'yup'
import { useAxiosInstance } from '../../hooks/useAxios'

interface AnswerMsgFormData {
  message: string
}

export const AddPreAnswerModal = ({ context, id, innerProps }: ContextModalProps<any>) => {
  const queryClient = useQueryClient()
  const axios = useAxiosInstance()

  const { register, handleSubmit } = useForm<AnswerMsgFormData>()
  const onSubmit = async (values: AnswerMsgFormData) => {
    const res = await axios.post('/users/hello', {
      hello: values.message
    })

    console.log(res)

    await queryClient.invalidateQueries('user-config')
    context.closeModal(id)
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Textarea required label="Texto" {...register('message')}></Textarea>
      <Space my={12} />

      <Button fullWidth mt={10} type="submit" color="teal">
        Agregar
      </Button>
    </form>
  )
}

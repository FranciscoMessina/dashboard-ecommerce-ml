import { Button, Space, Textarea } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { ContextModalProps } from '@mantine/modals'
import { useQueryClient } from 'react-query'
import * as Yup from 'yup'
import { useAxiosInstance } from '../../hooks/useAxios'

export const AddPostAnswerModal = ({ context, id, innerProps }: ContextModalProps<any>) => {
  const queryClient = useQueryClient()
  const axios = useAxiosInstance()

  const formSchema = Yup.object({
    message: Yup.string().required('El mensaje es requerido')
  })

  const form = useForm({
    initialValues: {
      message: ''
    },
    schema: yupResolver(formSchema)
  })

  const handleSubmit = async (values: typeof form.values) => {
    await axios.post('/user/postanswer', {
      message: values.message
    })

    await queryClient.invalidateQueries('user-config')
    context.closeModal(id)
  }
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Textarea required label="Texto" {...form.getInputProps('message')}></Textarea>
      <Space my={12} />

      <Button fullWidth mt={10} type="submit" color="teal">
        Agregar
      </Button>
    </form>
  )
}

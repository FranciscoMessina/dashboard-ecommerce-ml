import { Button, ColorInput, Group, Space, Textarea, TextInput } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { ContextModalProps } from '@mantine/modals'
import { useQueryClient } from 'react-query'
import * as Yup from 'yup'
import { useAxiosInstance } from '../../hooks/useAxios'

type InnerProps = {
  name?: string
  text?: string
  color?: string
  _id?: string
}

export const EditQuickAnswerModal = ({
  context,
  id,
  innerProps
}: ContextModalProps<InnerProps>) => {
  const queryClient = useQueryClient()
  const axios = useAxiosInstance()

  const formSchema = Yup.object({
    name: Yup.string().required('Porfavor completa el nombre'),
    text: Yup.string().required('Porfavor completa el texto'),
    color: Yup.string()
  })

  const form = useForm({
    initialValues: {
      name: innerProps.name,
      text: innerProps.text,
      color: innerProps.color
    },
    schema: yupResolver(formSchema)
  })

  const editQuickAnswer = (values: typeof form.values) => {
    axios
      .put(`/user/quickanswers/${innerProps._id}`, {
        name: values.name,
        text: values.text,
        color: values.color
      })
      .then(() => {
        queryClient.invalidateQueries('user-config')
        context.closeModal(id)
      })
  }
  return (
    <form onSubmit={form.onSubmit(editQuickAnswer)}>
      <TextInput required label="Nombre" {...form.getInputProps('name')}></TextInput>
      <Space my={12} />
      <Textarea required label="Texto" {...form.getInputProps('text')} maxLength={2000}></Textarea>
      <Space my={12} />
      <Group align={'end'} noWrap>
        <ColorInput label="Color" {...form.getInputProps('color')}></ColorInput>
        <Button fullWidth mt={10} type="submit" color="cyan">
          Editar
        </Button>
      </Group>
    </form>
  )
}

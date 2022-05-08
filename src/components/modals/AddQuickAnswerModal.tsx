import {
  Button,
  ColorInput,
  Group,
  Space,
  Textarea,
  TextInput,
  useMantineTheme
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'

import { ContextModalProps } from '@mantine/modals'
import { useQueryClient } from 'react-query'
import * as Yup from 'yup'
import { useAxiosInstance } from '../../hooks/useAxios'

export const AddQuickAnswerModal = ({ context, id, innerProps }: ContextModalProps<any>) => {
  const theme = useMantineTheme()
  const queryClient = useQueryClient()
  const axios = useAxiosInstance()

  const formSchema = Yup.object({
    name: Yup.string().required('El nombre es requerido'),
    text: Yup.string().required('El texto es requerido'),
    color: Yup.string()
  })

  const form = useForm({
    initialValues: {
      name: '',
      text: '',
      color: theme.colors.blue[8]
    },
    schema: yupResolver(formSchema)
  })

  const handleSubmit = (values: typeof form.values) => {
    axios
      .post('/user/quickanswers', {
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
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <TextInput required label="Nombre" {...form.getInputProps('name')}></TextInput>
      <Space my={12} />
      <Textarea required label="Texto" {...form.getInputProps('text')}></Textarea>
      <Space my={12} />
      <Group align={'end'} noWrap>
        <ColorInput label="Color" {...form.getInputProps('color')}></ColorInput>
        <Button fullWidth mt={10} type="submit" color="teal">
          Agregar
        </Button>
      </Group>
    </form>
  )
}

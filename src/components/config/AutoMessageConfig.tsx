import {
  Button,
  Center,
  Checkbox,
  Group,
  Paper,
  Text,
  Textarea,
  Title,
  Tooltip
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { useBooleanToggle } from '@mantine/hooks'
import { useQueryClient } from 'react-query'
import { InfoCircle } from 'tabler-icons-react'
import { useAxiosInstance } from '../../hooks/useAxios'

interface AutoMessageConfigProps {
  saleMsg: {
    enabled?: boolean
    text?: string
  }
}

export function AutoMessageConfig({ saleMsg }: AutoMessageConfigProps) {
  const [edit, toggleEdit] = useBooleanToggle(false)
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  const form = useForm({
    initialValues: {
      message: saleMsg?.text || '',
      enabled: saleMsg?.enabled || ''
    }
  })

  const handleSubmit = async (values: typeof form.values) => {
    toggleEdit()

    await axios.put('/user/salemsg', {
      message: values.message,
      enabled: values.enabled
    })

    await queryClient.invalidateQueries('user-config')
  }

  return (
    <Paper
      p="sm"
      shadow="md"
      sx={(theme) => ({
        width: '100%'
      })}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group position="apart" mb="md">
          <Group direction="column" spacing={0}>
            <Title order={3}>Mensaje automatico:</Title>

            <Group spacing={4}>
              <Tooltip
                wrapLines
                width={190}
                position="top"
                placement="end"
                withArrow
                label="Podes usar %FIRST_NAME% y %NICKNAME% y seran remplazados por los datos del cliente"
              >
                <Center>
                  <InfoCircle size={18} />
                </Center>
              </Tooltip>
              <Text size="xs">
                Mensaje que se envia al comprador cuando se acredita su pago si eligio la opción de
                acordar entrega.
              </Text>
            </Group>
          </Group>

          <Group>
            {saleMsg?.text ? (
              <>
                {edit ? (
                  <>
                    <Button color="green" variant="subtle" type="submit">
                      Guardar
                    </Button>

                    <Button
                      color="gray"
                      variant="subtle"
                      type="button"
                      onClick={() => {
                        toggleEdit()
                        form.reset()
                      }}
                    >
                      Cancelar
                    </Button>
                  </>
                ) : (
                  <Button
                    component="div"
                    color="yellow"
                    variant="subtle"
                    onClick={() => toggleEdit()}
                  >
                    Editar
                  </Button>
                )}
              </>
            ) : (
              <Button variant="subtle">Agregar</Button>
            )}
          </Group>
        </Group>
        {saleMsg?.text && (
          <Textarea
            autosize
            minRows={4}
            maxRows={10}
            readOnly={!edit}
            maxLength={2000}
            {...form.getInputProps('message')}
          ></Textarea>
        )}

        <Checkbox
          mt="md"
          label="Define si se envia el mensaje o no"
          disabled={!edit}
          {...form.getInputProps('enabled', { type: 'checkbox' })}
        />
      </form>
    </Paper>
  )
}

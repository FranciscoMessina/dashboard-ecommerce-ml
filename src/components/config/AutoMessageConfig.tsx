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
import { useBooleanToggle } from '@mantine/hooks'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { InfoCircle } from 'tabler-icons-react'
import { useAxiosInstance } from '../../hooks/useAxiosInstance'

interface AutoMessageConfigProps {
  autoMessage: {
    enabled?: boolean
    message?: string
  }
}

interface AutoMessageFormData {
  message: string
  enabled: boolean
}

export function AutoMessageConfig({ autoMessage }: AutoMessageConfigProps) {
  const [edit, toggleEdit] = useBooleanToggle(false)
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset } = useForm<AutoMessageFormData>({
    defaultValues: {
      message: autoMessage.message || '',
      enabled: autoMessage.enabled || false
    }
  })

  const onSubmit = async (values: AutoMessageFormData) => {
    toggleEdit()

    await axios.put('/users/automessages', {
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
      <form onSubmit={handleSubmit(onSubmit)}>
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
                label="Podes usar @NOMBRE y @USUARIO, seran remplazados por los datos del cliente"
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
            {autoMessage?.message ? (
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
                        reset()
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
        {autoMessage?.message && (
          <Textarea
            autosize
            minRows={4}
            maxRows={10}
            readOnly={!edit}
            maxLength={2000}
            {...register('message')}
          ></Textarea>
        )}

        <Checkbox
          mt="md"
          label="Define si se envia el mensaje o no"
          disabled={!edit}
          {...register('enabled')}
        />
      </form>
    </Paper>
  )
}

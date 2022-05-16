import { Button, Center, Group, Paper, Text, Title, Tooltip } from '@mantine/core'
import { useModals } from '@mantine/modals'
import React from 'react'
import { useQueryClient } from 'react-query'
import { InfoCircle } from 'tabler-icons-react'
import { useAxiosInstance } from '../../hooks/useAxiosInstance'

interface QuestionsConfigProps {
  messages?: {
    hello?: string
    signature?: string
  }
}

export function QuestionsConfig({ messages }: QuestionsConfigProps) {
  const queryClient = useQueryClient()
  const modals = useModals()
  const axios = useAxiosInstance()

  console.log(messages);
  

  const addPreAnswerMessage = async () => {
    modals.openContextModal('addPreAnswer', {
      title: 'Agregar mensaje pre-respuesta',
      innerProps: {}
    })
  }

  const editPreAnswerMessage = async (message: string) => {
    modals.openContextModal('editPreAnswer', {
      title: 'Agregar mensaje pre-respuesta',
      innerProps: { message }
    })
  }

  const deletePreAnswer = async () => {
    const response = await axios.delete('/users/hello')
    await queryClient.invalidateQueries('user-config')
  }
  const addPostAnswerMessage = async () => {
    modals.openContextModal('addPostAnswer', {
      title: 'Agregar mensaje post-respuesta',
      innerProps: {}
    })
  }

  const editPostAnswerMessage = async (message: string) => {
    modals.openContextModal('editPostAnswer', {
      title: 'Agregar mensaje post-respuesta',
      innerProps: { message }
    })
  }

  const deletePostAnswer = async () => {
    const response = await axios.delete('/users/signature')
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
      <Title order={3}>Preguntas:</Title>
      <Group position="apart" my="md">
        <Group spacing={4}>
          <Tooltip
            wrapLines
            width={120}
            position="top"
            placement="end"
            withArrow
            label="Mensaje que se agrega delante de tu respuesta a la pregunta del
									comprador"
          >
            <Center>
              <InfoCircle size={18} />
            </Center>
          </Tooltip>
          <Text inline weight={500}>
            Saludo inicial:
          </Text>
          <Text inline ml={10}>
            {messages?.hello}
          </Text>
        </Group>
        <Group>
          {messages?.hello ? (
            <>
              <Button
                color="yellow"
                variant="subtle"
                onClick={() => editPreAnswerMessage(messages.hello!)}
              >
                Editar
              </Button>
              <Button color="red" variant="subtle" onClick={deletePreAnswer}>
                Eliminar
              </Button>
            </>
          ) : (
            <Button onClick={addPreAnswerMessage}>Agregar</Button>
          )}
        </Group>
      </Group>
      <Group position="apart">
        <Group spacing={4} align="center" position="center">
          <Tooltip
            wrapLines
            width={120}
            placement="end"
            position="top"
            withArrow
            label="Mensaje que se agrega detras de tu respuesta a la pregunta del
									comprador"
          >
            <Center>
              <InfoCircle size={18} />
            </Center>
          </Tooltip>

          <Text inline weight={500}>
            Saludo final:
          </Text>
          <Text inline ml={10}>
            {messages?.signature}
          </Text>
        </Group>
        <Group>
          {messages?.signature ? (
            <>
              <Button
                color="yellow"
                variant="subtle"
                onClick={() => editPostAnswerMessage(messages.signature!)}
              >
                Editar
              </Button>
              <Button color="red" variant="subtle" onClick={deletePostAnswer}>
                Eliminar
              </Button>
            </>
          ) : (
            <Button onClick={addPostAnswerMessage}>Agregar</Button>
          )}
        </Group>
      </Group>
    </Paper>
  )
}

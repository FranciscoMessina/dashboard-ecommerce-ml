import {
  ActionIcon,
  Box,
  Button,
  Center,
  Collapse,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Text,
  Title
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useModals } from '@mantine/modals'
import React, { MouseEvent } from 'react'
import { useQueryClient } from 'react-query'
import { ChevronDown, ChevronUp } from 'tabler-icons-react'
import { useAxiosInstance } from '../../hooks/useAxios'
import type { QuickAnswer as QuickAnswerType } from '../../types/types'
import QuickAnswer from '../QuickAnswer'

interface QuickAnswersConfigProps {
  quickAnswers: QuickAnswerType[]
}

export function QuickAnswersConfig({ quickAnswers }: QuickAnswersConfigProps) {
  const queryClient = useQueryClient()
  const modals = useModals()
  const axios = useAxiosInstance()

  const [show, handlers] = useDisclosure(false)

  const deleteQuickAnswer = async (id: string) => {
    const response = await axios.delete(`/user/quickanswers/${id}`)
    queryClient.invalidateQueries('user-config')
  }

  const startAddQuickAnswer = (e: MouseEvent<HTMLButtonElement>) => {
    modals.openContextModal('addQuickAnswer', {
      title: 'Agregar respuesta rapida',
      innerProps: {}
    })
  }

  const startEditQuickAnswer = (answer: QuickAnswerType) => {
    modals.openContextModal('editQuickAnswer', {
      title: 'Editar respuesta rapida',
      innerProps: {
        ...answer
      }
    })
  }

  return (
    <Paper
      p="sm"
      shadow="md"
      sx={(theme) => ({
        width: '100%'
      })}
    >
      <Group position="apart">
        <Title order={3}>Respuestas rapidas:</Title>
        <Group>
          <ActionIcon onClick={handlers.toggle}>
            {!show ? <ChevronDown /> : <ChevronUp />}
          </ActionIcon>
          <Button onClick={startAddQuickAnswer}>Agregar</Button>
        </Group>
      </Group>
      <Collapse in={show}>
        {quickAnswers.length === 0 ? (
          <Center p="md">
            <Text> No tenes respuestas rapidas, crea una nueva! </Text>
          </Center>
        ) : (
          <ScrollArea
            sx={{
              height: quickAnswers.length * 64,
              minHeight: 100,
              maxHeight: 340,
              width: '100%'
            }}
            offsetScrollbars
          >
            <Box
              p="sm"
              sx={{
                position: 'relative'
              }}
            >
              <Paper
                sx={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 10
                }}
                radius={0}
                mb={10}
              >
                <Group position="apart" mr={110}>
                  <Title order={6}>Nombre</Title>
                  <Title order={6}>Texto</Title>
                  <Title order={6}>Acciones</Title>
                </Group>
                <Divider />
              </Paper>

              {quickAnswers.map((answer, index) => (
                <Group position="apart" key={answer._id}>
                  <Box
                    sx={{
                      backgroundColor: answer.color,
                      borderRadius: 2,
                      width: 180
                    }}
                  >
                    <QuickAnswer {...answer} />
                  </Box>

                  <Text>{answer.text}</Text>

                  <Group>
                    <Button
                      variant="subtle"
                      color="yellow"
                      onClick={() => startEditQuickAnswer(answer)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="subtle"
                      color="red"
                      onClick={() => deleteQuickAnswer(answer._id)}
                    >
                      Eliminar
                    </Button>
                  </Group>
                </Group>
              ))}
            </Box>
          </ScrollArea>
        )}
      </Collapse>
    </Paper>
  )
}

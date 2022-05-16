import {
  Button,
  Center,
  CloseButton,
  ColorSwatch,
  createStyles,
  Divider,
  Group,
  ScrollArea,
  Space,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import * as Dialog from '@radix-ui/react-dialog'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { useAxiosInstance } from '../../hooks/useAxiosInstance.js'
import { useGetQuickAnswersQuery } from '../../hooks/useGetQuickAnswersQuery.js'
import { EditableQuickAnswer } from './EditableQuickAnswer'

const useStyles = createStyles((theme, { color }: { color: string }) => ({
  dragHandle: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md
  },

  input: {
    backgroundColor: color,
    textTransform: 'uppercase',
    color: theme.white,
    fontWeight: 600,
    textAlign: 'center',
    width: '190px',
    '&::placeholder': {
      color: theme.colors.gray[1],
      fontWeight: 600
    },
    '&:disabled': {
      backgroundColor: color,
      color: theme.white
    }
  }
}))

interface CreateQuickAnswerFormData {
  name: string
  text: string
}

interface QuickAnswersModalContentProps {}

export const QuickAnswersModalContent: React.FC<QuickAnswersModalContentProps> = ({}) => {
  const quickAnswers = useGetQuickAnswersQuery('', {
    cacheTime: 36000,
    refetchInterval: 36000
  })
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()
  const [color, setColor] = useState('#3bc9db')
  const { theme, classes } = useStyles({ color })

  const COLORS = [
    theme.colors.violet[4],
    theme.colors.blue[4],
    theme.colors.cyan[4],
    theme.colors.teal[4],
    theme.colors.green[4]
  ]

  const { handleSubmit, register, formState, reset } = useForm({
    defaultValues: {
      text: '',
      name: ''
    }
  })

  const createQuickAnswer = async (values: CreateQuickAnswerFormData) => {
    try {
      const response = await axios.post('/users/quickanswers', {
        name: values.name,
        text: values.text,
        color: color
      })
    } catch (err) {
      const error = err as AxiosError
      console.log(error.response)
    } finally {
      reset()
      await queryClient.refetchQueries(['quickanswers'], {
        active: true
      })
    }
  }

  const hasQuickAnswers =
    quickAnswers.data?.data.results && quickAnswers.data.data.results.length > 0

  return (
    <>
      <Group position="apart" p={0} m={0} align="start">
        <Dialog.Title asChild>
          <div>
            <Text size="xl">Respuestas rápidas</Text>
            <Space my="lg" />
          </div>
        </Dialog.Title>
        <Dialog.Close asChild>
          <CloseButton />
        </Dialog.Close>
      </Group>
      <form onSubmit={handleSubmit(createQuickAnswer)}>
        <Group noWrap align="center">
          <Group
            direction="column"
            grow
            spacing={4}
            sx={{
              width: '246px'
            }}
          >
            <TextInput
              placeholder="Etiqueta"
              {...register('name', {
                required: {
                  value: true,
                  message: 'Por favor completar'
                }
              })}
              styles={{
                // @ts-ignore
                input: classes.input
              }}
              error={formState.errors.name?.message}
            />
            <Group>
              {COLORS.map((color, index) => (
                <ColorSwatch
                  radius="xs"
                  key={index}
                  color={color}
                  onClick={() => setColor(color)}
                  sx={{ cursor: 'pointer' }}
                />
              ))}
            </Group>
          </Group>
          <Textarea
            sx={{ width: '100%' }}
            placeholder="Ingresa una nueva respuesta rapida"
            maxLength={1000}
            {...register('text', {
              required: {
                value: true,
                message: 'Por favor completar'
              }
            })}
            error={formState.errors.text?.message}
            spellCheck
          />
          <Button type="submit">Agregar</Button>
        </Group>
      </form>
      <Divider my="md" />

      <ScrollArea
        style={{ height: '80%', margin: '10 0' }}
        type="hover"
        scrollbarSize={10}
        offsetScrollbars
      >
        {hasQuickAnswers ? (
          quickAnswers.data?.data.results.map((answer, index) => {
            return <EditableQuickAnswer key={index} quickAnswer={answer} index={index} />
          })
        ) : (
          <Center>
            <Text>No tenes respuestas rapidas</Text>
          </Center>
        )}
      </ScrollArea>
    </>
  )
}

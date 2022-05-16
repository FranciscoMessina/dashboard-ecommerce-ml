import {
  ActionIcon,
  ColorSwatch,
  createStyles,
  Group,
  Stack,
  Textarea,
  TextInput,
  Tooltip,
  useMantineTheme
} from '@mantine/core'
import { useBooleanToggle } from '@mantine/hooks'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { AxisY, FileDownload, FileX, Pencil, TrashX } from 'tabler-icons-react'
import { useAxiosInstance } from '../../hooks/useAxiosInstance.js'
import { QuickAnswer as QAType } from '../../types/types.js'

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

interface EditableQuickAnswerProps {
  quickAnswer: QAType
  index: number
}

export const EditableQuickAnswer: React.FC<EditableQuickAnswerProps> = ({ quickAnswer, index }) => {
  const queryClient = useQueryClient()

  const [edit, toggleEdit] = useBooleanToggle(false)
  const theme = useMantineTheme()
  const axios = useAxiosInstance()
  const COLORS = [
    theme.colors.violet[4],
    theme.colors.blue[4],
    theme.colors.cyan[4],
    theme.colors.teal[4],
    theme.colors.green[4]
  ]

  const [color, setColor] = useState(quickAnswer.color)
  const { classes } = useStyles({ color })

  const { reset, register, formState, handleSubmit } = useForm({
    defaultValues: {
      name: quickAnswer.name,
      text: quickAnswer.text,
      id: quickAnswer.id,
      position: quickAnswer.position,
      color: ''
    }
  })

  const updateQuickAnswer = async (values: QAType) => {
    const noChanges =
      values.name === quickAnswer.name &&
      values.text === quickAnswer.text &&
      color === quickAnswer.color

    if (noChanges) return

    try {
      const response = await axios.put(`users/quickanswers/${values.id}`, {
        name: values.name,
        text: values.text,
        color: color
      })

      console.log(response)
    } catch (err) {
      console.log(err)
    } finally {
      await queryClient.refetchQueries(['quickanswers'], {
        active: true
      })
      toggleEdit()
    }
  }

  const deleteQuickAnswer = async () => {
    try {
      const response = await axios.delete(`users/quickanswers/${quickAnswer.id}`)

      console.log(response)
    } catch (err) {
      console.log(err)
    } finally {
      await queryClient.refetchQueries(['quickanswers'], {
        active: true
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(updateQuickAnswer)} style={{ margin: '15px 0px' }}>
      <Group direction="row" sx={{ width: '100%' }} align="start" noWrap>
        <Group
          direction="column"
          spacing={4}
          sx={{
            width: '246px'
          }}
        >
          <TextInput
            disabled={!edit}
            placeholder="Etiqueta"
            {...register('name', {
              required: {
                value: true,
                message: 'Por favor completar'
              }
            })}
            // @ts-ignore
            styles={{ input: classes.input }}
            error={formState.errors.name?.message}
          />
          {edit && (
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
          )}
        </Group>
        <Textarea
          {...register('text', {
            required: {
              value: true,
              message: 'Por favor completar'
            }
          })}
          error={formState.errors.text?.message}
          sx={{ width: '100%' }}
          disabled={!edit}
        />
        <Group spacing="xs" noWrap mr="md">
          {!edit ? (
            <Stack spacing="xs">
              <Tooltip wrapLines position="right" placement="center" withArrow label="Editar">
                <ActionIcon onClick={() => toggleEdit()}>
                  <Pencil />
                </ActionIcon>
              </Tooltip>
              <Tooltip wrapLines position="right" placement="center" withArrow label="Eliminar">
                <ActionIcon onClick={deleteQuickAnswer}>
                  <TrashX />
                </ActionIcon>
              </Tooltip>
            </Stack>
          ) : (
            <Stack spacing="xs">
              <Tooltip wrapLines position="right" placement="center" withArrow label="Guardar">
                <ActionIcon color="green" type="submit">
                  <FileDownload />
                </ActionIcon>
              </Tooltip>
              <Tooltip wrapLines position="right" placement="center" withArrow label="Cancelar">
                <ActionIcon
                  onClick={() => {
                    reset()
                    setColor(quickAnswer.color)
                    toggleEdit()
                  }}
                >
                  <FileX />
                </ActionIcon>
              </Tooltip>
            </Stack>
          )}

          {/* <GripHorizontal /> */}
        </Group>
      </Group>
    </form>
  )
}

import {
  ActionIcon,
  Button,
  ColorSwatch,
  createStyles,
  Divider,
  Group,
  MediaQuery,
  Overlay,
  Paper,
  ScrollArea,
  Space,
  Text,
  Textarea,
  TextInput
} from '@mantine/core'
import * as Dialog from '@radix-ui/react-dialog'
import { head } from 'lodash'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { Edit } from 'tabler-icons-react'
import QuickAnswer from '../components/QuickAnswer'
import { useAxiosInstance } from '../hooks/useAxios'
import { useGetQuickAnswersQuery } from '../hooks/useSearchQuickAnswersQuery'

const useStyles = createStyles((theme) => ({
  content: {
    zIndex: 102,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
    borderRadius: 6,
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    maxWidth: '950px',
    height: '80vh',
    padding: 25,
    '&:focus': { outline: 'none' }
  }
}))

function QuickAnswersDisplay() {
  const { classes, theme } = useStyles()
  const queryClient = useQueryClient()
  const axios = useAxiosInstance()
  const [color, setColor] = useState(theme.colors.grape[6])
  const quickAnswers = useGetQuickAnswersQuery('', {
    cacheTime: 36000
  })

  const COLORS = [
    theme.colors.violet[4],
    theme.colors.blue[4],
    theme.colors.cyan[4],
    theme.colors.teal[4],
    theme.colors.green[4]
  ]

  return (
    <Dialog.Root>
      <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
        <Paper
          shadow="md"
          p="sm"
          sx={{
            maxHeight: '90vh',
            position: 'sticky',
            top: '4.5rem',
            width: '243px'
          }}
          radius="sm"
        >
          <Group position="apart">
            <Text weight={500} align="left" size="lg">
              Respuestas Rapidas
            </Text>
            <Dialog.Trigger asChild>
              <ActionIcon aria-label="Manage Quick Answers" color="dimmed">
                <Edit />
              </ActionIcon>
            </Dialog.Trigger>
          </Group>
          <Divider mb="md" mt="xs" />

          <ScrollArea
            style={{ height: '80vh', width: '250px' }}
            type="hover"
            offsetScrollbars
            scrollbarSize={0}
          >
            {quickAnswers.data?.data.results ? (
              quickAnswers.data?.data.results.map((answer) => (
                <QuickAnswer key={answer.id} {...answer} draggable />
              ))
            ) : (
              <Text>No tenes respuestas rapidas</Text>
            )}
          </ScrollArea>
        </Paper>
      </MediaQuery>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <Overlay
            zIndex={101}
            blur={1}
            color={theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[5]}
          />
        </Dialog.Overlay>
        <Dialog.Content className={classes.content}>
          <Dialog.Title asChild>
            <div>
              <Text size="xl">Respuestas rápidas</Text>
              <Space my="lg" />
            </div>
          </Dialog.Title>
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
                styles={{
                  input: {
                    backgroundColor: color,
                    textTransform: 'uppercase',
                    color: theme.white,
                    fontWeight: 600,
                    textAlign: 'center',
                    width: '190px',
                    '&::placeholder': {
                      color: theme.white,
                      fontWeight: 600
                    }
                  }
                }}
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
              spellCheck
            />
            <Button>Agregar</Button>
          </Group>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default QuickAnswersDisplay

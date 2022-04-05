import { Text, Group, Box, Paper, Collapse } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FC } from 'react'
import { ChevronDown, ChevronUp, Message, Message2 } from 'tabler-icons-react'
import { PreviousQuestion } from '../../types/types'

interface PreviousQuestionsProps {
  questions: PreviousQuestion[]
  buyer: string
}

export const PreviousQuestions: FC<PreviousQuestionsProps> = ({ questions, buyer }) => {
  const [show, handlers] = useDisclosure(false)

  // console.log(questions)

  return (
    <Paper shadow={'md'}>
      <Group
        mt={8}
        direction="column"
        px={6}
        py={2}
        sx={(theme) => ({
          border: '1px solid',
          borderColor: theme.colors.blue[7],
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[3]
        })}
      >
        <Group
          onClick={() => handlers.toggle()}
          sx={{ width: '100%', cursor: 'pointer', userSelect: 'none' }}
          align="center"
          position="apart"
          noWrap
        >
          <Group spacing={4}>
            <Text size="sm">Preguntas anteriores de</Text>
            <Text size="sm" weight={600}>
              {buyer}
            </Text>
          </Group>

          {!show ? <ChevronDown /> : <ChevronUp className="h-5 w-5" />}
        </Group>
      </Group>
      <Collapse in={show}>
        {questions.map((question, index) => (
          <Box
            p="xs"
            sx={(theme) => ({
              border: '1px solid',
              borderTop: 0,
              borderColor: theme.colors.blue[7],
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[3]
            })}
            key={index}
          >
            <Group align={'start'} noWrap>
              <Message size={24} style={{ alignSelf: 'flex-start' }} />
              <Text
                sx={(theme) => ({
                  flex: ' 1 1 0%'
                })}
              >
                {question.text}
              </Text>
            </Group>
            <Text
              size="xs"
              sx={(theme) => ({
                fontStyle: 'italic',
                display: 'flex',
                justifyContent: 'flex-end'
              })}
            >
              {new Date(question.date_created).toLocaleDateString('es-ar', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
            <Group>
              <Message2 />
              <Text
                sx={(theme) => ({
                  flex: ' 1 1 0%'
                })}
              >
                {question.answer.text}
              </Text>
            </Group>
            <Text
              size="xs"
              sx={(theme) => ({
                fontStyle: 'italic',
                display: 'flex',
                justifyContent: 'flex-end'
              })}
            >
              {new Date(question.answer.date_created).toLocaleDateString('es-ar', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </Box>
        ))}
      </Collapse>
    </Paper>
  )
}

export default PreviousQuestions

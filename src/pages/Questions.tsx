import {
  Center,
  ScrollArea,
  Grid,
  Group,
  MediaQuery,
  Text,
  Loader,
  Container,
  Box,
  Tabs
} from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { Layout } from '../components/Layout'

import Question from '../components/question/Question'
import QuickAnswersDisplay from '../components/QuickAnswersDisplay'
import { useGetQuestionsQuery } from '../hooks/useGetQuestionsQuery'
import { MeliQuestionData } from '../types/types'

export default function Questions() {
  const questionsData = useGetQuestionsQuery({})

  const { data, isLoading, error, isError } = questionsData

  useDocumentTitle(
    `${
      data?.data?.total && data?.data?.total > 0 && `(${data?.data?.total})`
    } Preguntas - El Rio Libros`
  )

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    )
  }

  if (isError) {
    return <Layout>Algo salio mal, aca el error: {error?.message}</Layout>
  }

  return (
    <Center>
      <Tabs>
        <Tabs.Tab label="Pendientes">
          <Container fluid px={0}>
            <Group noWrap align="start" position="center">
              <Group direction="column">
                {data?.data.questions?.length! > 0 ? (
                  data?.data.questions.map((question: MeliQuestionData) =>
                    question.status === 'UNANSWERED' ? (
                      <Question question={question} key={question.id} />
                    ) : null
                  )
                ) : (
                  <Center
                    sx={(theme) => ({
                      width: '100%',
                      border: '1px solid',
                      borderRadius: theme.radius.sm,
                      borderColor: theme.colors.teal[5],
                      backgroundColor: theme.colorScheme === 'dark' ? '' : theme.colors.teal[1]
                    })}
                    mt={14}
                  >
                    <Text color="teal">
                      Ya respondiste todas las preguntas! O algo salio mal, no esta tan completo
                      esto.
                    </Text>
                  </Center>
                )}
              </Group>

              <QuickAnswersDisplay />
            </Group>
          </Container>
        </Tabs.Tab>
        <Tabs.Tab label="Historial">
          <Container
            size="xl"
            sx={(theme) => ({
              [theme.fn.largerThan('xl')]: {
                minWidth: theme.breakpoints.xl + 185
              }
            })}
            px={0}
          >
            <Center
              sx={(theme) => ({
                border: '1px solid',
                borderRadius: theme.radius.sm,
                borderColor: theme.colors.teal[5],
                backgroundColor: theme.colorScheme === 'dark' ? '' : theme.colors.teal[1]
              })}
              mt={14}
            >
              <Text color="teal">Aca va ir el historial de preguntas respondidas.</Text>
            </Center>
          </Container>
        </Tabs.Tab>
      </Tabs>
    </Center>
  )
}

import { Center, ScrollArea, Grid, Group, MediaQuery, Text, Loader } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { Layout } from '../components/Layout'

import Question from '../components/Question'
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
    <Grid columns={5} gutter="md" justify="center" grow>
      <Grid.Col span={4}>
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
                Ya respondiste todas las preguntas! O algo salio mal, no esta tan completo esto.
              </Text>
            </Center>
          )}
        </Group>
      </Grid.Col>
      <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
        <Grid.Col span={1}>
          <QuickAnswersDisplay />
        </Grid.Col>
      </MediaQuery>
    </Grid>
  )
}

import { Center, Group, Loader, Pagination, Stack, Text } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PendingQuestion from '../components/questions/PendingQuestion'
import QuickAnswersDisplay from '../components/questions/QuickAnswersDisplay'
import { useGetQuestionsQuery } from '../hooks/useGetQuestionsQuery'
import { MeliQuestionData } from '../types/types'

export default function PendingQuestions() {
  const [offset, setOffset] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/questions/pending')
  }, [])

  const questionsData = useGetQuestionsQuery(offset, {
    keepPreviousData: true,
    cacheTime: 1000 * 60 * 5,
    refetchInterval: false,
    select: (data) => data,
    retry: 1
  })

  const { data, isLoading, error, isError, isFetching, isSuccess } = questionsData

  // console.log(data?.data)

  useDocumentTitle(
    `${data?.data?.total && data?.data?.total > 0 ? `(${data?.data?.total})` : ''} Preguntas`
  )

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    )
  }

  if (isError) {
    return <Center>Algo salio mal, aca el error: {error?.message}</Center>
  }

  return (
    <Group align="start" position="apart" spacing="xl" noWrap sx={{ width: '100%' }}>
      <Group
        grow
        position="center"
        sx={(theme) => ({
          width: '100%'
        })}
      >
        {data?.data?.total! > 0 ? (
          <>
            {data?.data.results.map((question: MeliQuestionData) => (
              <PendingQuestion question={question} key={question.id} />
            ))}
            <Stack>
              {isFetching && (
                <Center>
                  <Loader variant="dots" />
                </Center>
              )}
              {isSuccess && data?.data.limit < data?.data.total && (
                <Center>
                  <Pagination
                    onChange={(page) => {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                      })
                      setOffset(page === 1 ? 0 : (page - 1) * data.data.limit)
                    }}
                    total={Math.ceil(data?.data.total! / data?.data.limit!)}
                  />
                </Center>
              )}
            </Stack>
          </>
        ) : (
          <Text
            color="teal"
            align="center"
            sx={(theme) => ({
              width: '100%',
              border: '1px solid',
              borderRadius: theme.radius.sm,
              borderColor: theme.colors.teal[5],
              backgroundColor: theme.colorScheme === 'dark' ? '' : theme.colors.teal[1]
            })}
          >
            Ya respondiste todas las preguntas! O algo salio mal, no esta tan completo esto.
          </Text>
        )}
      </Group>

      <QuickAnswersDisplay />
    </Group>
  )
}

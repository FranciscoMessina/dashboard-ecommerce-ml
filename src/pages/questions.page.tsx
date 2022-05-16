import {
  ActionIcon,
  Center,
  Container,
  createStyles,
  Divider,
  Group,
  Loader,
  Pagination,
  Stack,
  Text,
  UnstyledButton
} from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Settings } from 'tabler-icons-react'
import PendingQuestion from '../components/questions/pending-question.component'
import QuickAnswersDisplay from '../components/questions/quick-answers-display.component'
import { useGetQuestionsQuery } from '../hooks/useGetQuestionsQuery'
import { MeliQuestionData } from '../types/types'

const useStyles = createStyles((theme) => ({
  link: {
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[8],
    padding: '10px',
    borderRadius: '3px',
    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0]
    }
  },
  linkActive: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][1],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 7]
    }
  }
}))

export default function PendingQuestions() {
  const { cx, classes } = useStyles()

  const [offset, setOffset] = useState(0)

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
    `${
      data?.data?.total && data?.data?.total > 0 ? `(${data?.data?.total})` : ''
    } Preguntas`
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

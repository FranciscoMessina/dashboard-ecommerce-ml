import { Center, ScrollArea, Group, Paper, Title, Loader } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { AutoMessageConfig } from '../components/config/AutoMessageConfig'
import { QuestionsConfig } from '../components/config/QuestionsConfig'
import { QuickAnswersConfig } from '../components/config/QuickAnswersConfig'
import { useUserConfigQuery } from '../hooks/useUserConfigQuery'

const Settings: React.FC = () => {
  useDocumentTitle('Configuración - El Rio Libros')
  const userConfigResult = useUserConfigQuery()

  const { data, isError, error, isLoading } = userConfigResult

  if (isError) {
    return <div> Error: {error?.message}</div>
  }

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    )
  }
  return (
    <Group
      direction="column"
      sx={(theme) => ({
        width: '100%'
      })}
    >
      <Paper
        p="sm"
        shadow="md"
        sx={(theme) => ({
          width: '100%'
        })}
      >
        <Title order={2}>Configuración</Title>
      </Paper>
      <QuickAnswersConfig quickAnswers={data?.data.quickAnswers! || []} />
      <QuestionsConfig
        messages={{
          preAnswer: data?.data.preAnswerMsg,
          postAnswer: data?.data.postAnswerMsg
        }}
      />
      <AutoMessageConfig saleMsg={data?.data.saleMsg!} />
    </Group>
  )
}

export default Settings

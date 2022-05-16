import { Center, Group, Loader, Paper, Title } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { AutoMessageConfig } from '../components/config/AutoMessageConfig'
import { QuestionsConfig } from '../components/config/QuestionsConfig'
import { useUserConfigQuery } from '../hooks/useUserConfigQuery'

const Settings: React.FC = () => {
  useDocumentTitle('Mensajes Automaticos')
  const userConfigResult = useUserConfigQuery()

  const { data, isError, error, isLoading } = userConfigResult

  console.log(data)

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

      <AutoMessageConfig autoMessage={data?.data.autoMessage!} />
    </Group>
  )
}

export default Settings

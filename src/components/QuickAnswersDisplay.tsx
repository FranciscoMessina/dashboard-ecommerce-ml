import { Divider, Group, MediaQuery, Paper, ScrollArea, Space, Text } from '@mantine/core'
import QuickAnswer from '../components/QuickAnswer'
import { useUserConfigQuery } from '../hooks/useUserConfigQuery'

function QuickAnswersDisplay() {
  const userConfig = useUserConfigQuery({})

  return (
    <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
      <Paper
        shadow="md"
        p="sm"
        sx={{
          maxHeight: '95vh',
          position: 'sticky',
          top: '4.5rem',
          minWidth: '250px'
        }}
        radius="sm"
      >
        <Text weight={600} align="center" size="lg">
          Respuestas Rapidas
        </Text>
        <Divider mb="md" mt="sm" />

        <ScrollArea style={{ height: '80vh' }} type="hover">
          <Group align="center" spacing={6}>
            {userConfig.data?.data.quickAnswers &&
              userConfig.data?.data.quickAnswers.map((answer) => (
                <QuickAnswer key={answer._id} {...answer} draggable />
              ))}
          </Group>
        </ScrollArea>
      </Paper>
    </MediaQuery>
  )
}

export default QuickAnswersDisplay

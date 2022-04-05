import { Divider, Group, Paper, ScrollArea, Space, Text } from '@mantine/core'
import QuickAnswer from '../components/QuickAnswer'
import { useUserConfigQuery } from '../hooks/useUserConfigQuery'

function QuickAnswersDisplay() {
  const userConfig = useUserConfigQuery({})

  return (
    <Paper
      shadow="md"
      p="sm"
      m="sm"
      sx={{
        maxHeight: '80vh',
        position: 'sticky',
        top: '4.2rem'
      }}
      radius="sm"
    >
      <Text weight={600} align="center" size="lg">
        Respuestas Rapidas
      </Text>
      <Divider mb="md" mt="sm" />

      <ScrollArea style={{ height: '70vh' }} type="hover">
        <Group align="center" spacing={6}>
          {userConfig.data?.data.quickAnswers &&
            userConfig.data?.data.quickAnswers.map((answer) => (
              <QuickAnswer key={answer._id} {...answer} draggable />
            ))}
        </Group>
      </ScrollArea>
    </Paper>
  )
}

export default QuickAnswersDisplay

import {
   ActionIcon, createStyles,
   Divider,
   Group,
   MediaQuery,
   Overlay,
   Paper,
   ScrollArea, Text
} from '@mantine/core'
import * as Dialog from '@radix-ui/react-dialog'
import { Edit } from 'tabler-icons-react'
import { QuickAnswer, QuickAnswersModalContent } from '.'
import { useGetQuickAnswersQuery } from '../../../hooks'


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
      maxWidth: '1200px',
      height: '80vh',
      overflow: 'hidden',
      padding: 25,
      '&:focus': { outline: 'none' }
   }
}))

export function QuickAnswersDisplay() {
   const { classes, theme } = useStyles()
   const quickAnswers = useGetQuickAnswersQuery('', {
      cacheTime: 36000,
      refetchInterval: 36000
   })

   const hasQuickAnswers =
      quickAnswers.data?.data.results && quickAnswers.data.data.results.length > 0

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
                     Respuestas rapidas
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
                  {hasQuickAnswers ? (
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
               {quickAnswers.data?.data.results && (
                  <QuickAnswersModalContent />
               )}
            </Dialog.Content>
         </Dialog.Portal>
      </Dialog.Root>
   )
}


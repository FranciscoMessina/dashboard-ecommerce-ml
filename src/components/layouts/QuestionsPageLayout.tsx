import { Group, ActionIcon, Divider, Container, createStyles, Loader, Center } from '@mantine/core'
import React, { Suspense, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { Settings } from 'tabler-icons-react'
import { QuestionsConfig } from '../ui'

interface QuestionsPageLayout { }

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

export const QuestionsPageLayout: React.FC<QuestionsPageLayout> = ({ }) => {
   const [open, setOpen] = useState(false)
   const { classes, cx } = useStyles()

   return (
      <Container size={1500}>
         <Group spacing={0} position="apart">
            <div>
               <NavLink
                  to="/questions/pending"
                  className={({ isActive }) => cx(classes.link, { [classes.linkActive]: isActive })}
               >
                  Pendientes
               </NavLink>

               <NavLink
                  to="/questions/history"
                  className={({ isActive }) => cx(classes.link, { [classes.linkActive]: isActive })}
                  style={{ marginLeft: '5px' }}
               >
                  Historial
               </NavLink>
            </div>
            <ActionIcon variant="transparent" onClick={() => setOpen(true)}>
               <Settings />
            </ActionIcon>
         </Group>
         <Divider mb="sm" mt="xs" />
         <Suspense fallback={<Center><Loader /></Center>}>
            <Outlet />
         </Suspense>
         <QuestionsConfig open={open} setOpen={setOpen} />
      </Container>
   )
}

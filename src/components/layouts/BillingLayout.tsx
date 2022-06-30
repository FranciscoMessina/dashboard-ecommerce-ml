import { Group, ActionIcon, Divider, Container, createStyles, Loader, Center, Button } from '@mantine/core'
import React, { Suspense, useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { FileInvoice, Settings } from 'tabler-icons-react'
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

export const BillingLayout: React.FC<QuestionsPageLayout> = ({ }) => {
   const { classes, cx } = useStyles()

   return (
      <Container size={1800}>
         <Group spacing={0} position="apart">
            <div>
               <NavLink
                  to="/invoices/pending"
                  className={({ isActive }) => cx(classes.link, { [classes.linkActive]: isActive })}
               >
                  Pendientes
               </NavLink>

               <NavLink
                  to="/invoices/emitted"
                  className={({ isActive }) => cx(classes.link, { [classes.linkActive]: isActive })}
                  style={{ marginLeft: '5px' }}
               >
                  Emitidas
               </NavLink>
            </div>
            <Button
               component={Link}
               rightIcon={<FileInvoice size={19} />}
               variant='subtle'
               to='new'
            >
               Nueva Factura
            </Button>
         </Group>
         <Divider mb="sm" mt="xs" />
         <Suspense fallback={<Center><Loader /></Center>}>
            <Outlet />
         </Suspense>
      </Container>
   )
}

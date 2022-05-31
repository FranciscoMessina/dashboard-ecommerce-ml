import { Button, Card, Center, Collapse, Container, Divider, Group, Paper, Space, Stack, Text, Title } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, FileInvoice } from 'tabler-icons-react'
import { Invoice } from '../components/ui'

export default function Billing() {
   useDocumentTitle('Facturas')


   return (
      <Container fluid>
         <Paper p="md" mb="xl" shadow="sm">
            <Group position='apart'>
               <Title order={1}>Facturas</Title>
               <Button
                  component={Link}
                  rightIcon={<FileInvoice size={19} />}
                  variant='light'
                  to='new'
               >
                  Nueva Factura
               </Button>
            </Group>
            <Divider my='xs' />

            <Group position='apart' noWrap >
               <Stack align='flex-start' sx={{ width: '50%' }}>
                  <Title order={3}> Pendientes</Title>
                  <Invoice />
               </Stack>
               <Divider orientation='vertical' mx='xs' sx={{ height: 'auto' }} />
               <Stack align='flex-start' sx={{ width: '50%' }}>
                  <Title order={3}> Emitidas</Title>
                  <Invoice />
               </Stack>
            </Group>
         </Paper>
      </Container>
   )
}

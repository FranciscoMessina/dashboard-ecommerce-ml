import { ActionIcon, Card, Container, Grid, Group, Text, Tooltip, Box, Button } from '@mantine/core'
import React from 'react'
import { Link } from 'react-router-dom'
import { Box as BoxIcon, Home2, QuestionMark, Plus, Message2Code, FileInvoice, Star, Anchor, Tag, Settings, ArrowRight } from 'tabler-icons-react'

const navLinks = [
   {
      id: 1,
      icon: Home2,
      label: 'Inicio',
      route: '/',
      desc: 'Pantalla de inicio, podes ver información general sobre el negocio.'
   },
   {
      id: 2,
      icon: QuestionMark,
      label: 'Preguntas',
      route: '/questions',
      desc: 'Pantalla para gestionar preguntas, podes responder las preguntas pendientes o ver el historial.'
   },
   {
      id: 3,
      icon: Tag,
      label: 'Ventas',
      route: '/orders',
      desc: 'Pantalla para gestionar ventas, podes ver el historial de ventas.'
   },
   {
      id: 4,
      icon: Plus,
      label: 'Publicar',
      route: '/publish',
      desc: 'Pantalla para publicar productos.'
   },
   {
      id: 5,
      icon: Message2Code,
      label: 'Mensajes Automaticos',
      route: '/automessages',
      desc: 'Pantalla para gestionar mensajes automaticos.'
   },
   {
      id: 6,
      icon: FileInvoice,
      label: 'Facturas',
      route: '/billing',
      desc: 'Pantalla para gestionar facturas.'
   },
   {
      id: 7,
      icon: BoxIcon,
      label: 'Publicaciones',
      route: '/items',
      desc: 'Pantalla para gestionar publicaciones.'
   },
   {
      id: 8,
      icon: Settings,
      label: 'Configuracion',
      route: '/settings',
      desc: 'Pantalla para gestionar configuraciones.'
   },
]

const items = navLinks.map(({ label, icon: Icon, route, desc, id }, index) => {
   return (
      <Grid.Col sm={3} lg={2} key={id}>
         <Card shadow='md' withBorder sx={{ minHeight: '190px', positiom: 'relative' }} >
            <Group position='apart'>

               <Group>
                  <Icon />
                  <Text>
                     {label}
                  </Text>
               </Group>

               <Tooltip label={`Agregar a favoritos`} position='left' transition='fade'>
                  <ActionIcon>
                     <Star size={16} />
                  </ActionIcon>
               </Tooltip>
            </Group>

            <Text size='sm' py='sm' color='dimmed' >
               {desc}
            </Text>

            <Button
               variant='subtle'
               sx={{ right: 5, bottom: 5, position: 'absolute' }}
               component={Link}
               to={route}
               rightIcon={<ArrowRight />}
            >
               Ir
            </Button>

         </Card>
      </Grid.Col>
   )
})

const PageSelect = () => {
   return (
      <Container size='xl'>
         <Grid justify='left' columns={8} grow>
            {items}
         </Grid>
      </Container>
   )
}

export default PageSelect
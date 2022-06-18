import { ActionIcon, Box, Button, Card, Collapse, Divider, Grid, Group, Text } from '@mantine/core'
import { useState } from 'react'
import { Pencil, Trash } from 'tabler-icons-react'


export const Invoice = () => {


   const pending = true;


   return (
      <Card sx={{ width: '100%' }} p='xs' withBorder>
         <Group
            noWrap
            position='apart'
            align='center'
            sx={{ width: '100%' }}
         >
            <Group>
               <Text>Factura...</Text>
               <Divider orientation='vertical' style={{ height: 'auto' }} />
               <Text>23/5/2015</Text>
            </Group>

            <Group align='center'>
               <Button size='xs' variant='outline'>
                  Ver detalle
               </Button>
               {pending && (
                  <>
                     <ActionIcon color='yellow' >
                        <Pencil size={22} />
                     </ActionIcon>
                     <ActionIcon color='red'>
                        <Trash size={22} />
                     </ActionIcon>
                  </>
               )}
            </Group>
         </Group>
         <Card.Section>
            <Divider my='sm' />
         </Card.Section>

         <Group position='apart' align='start'>
            <Text>Productos: 18</Text>
            <Text>Total: $ 650</Text>
            <Text>Cliente: Sin identificar</Text>
         </Group>
      </Card>
   )
}

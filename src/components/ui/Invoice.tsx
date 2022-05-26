import { Card, Collapse, Divider, Group, Text } from '@mantine/core'
import { useState } from 'react'


export const Invoice = () => {
   const [showItems, setShowItems] = useState(false)


   return (
      <Card sx={{ width: '100%' }} p='xs' withBorder>
         <Group
            noWrap
            position='apart'
            sx={{ width: '100%' }}
         >
            <Text>Factura...</Text>
            <Text>Total: $ 650</Text>
         </Group>
         <Card.Section>
            <Divider my='sm' />
         </Card.Section>

         <Group>
            <Text>Productos: 18</Text>
            <Collapse in={showItems}>
               <div>
                  Hello
               </div>
            </Collapse>
         </Group>
      </Card>
   )
}

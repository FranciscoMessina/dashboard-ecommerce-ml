import { Box, Card, Collapse, Divider, Grid, Group, Text } from '@mantine/core'
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

         <Grid>
            <Grid.Col span={6}>
               <Text>Productos: 18</Text>
            </Grid.Col>
            <Grid.Col span={4}>
               <Text>Cliente:</Text>
            </Grid.Col>
         </Grid>
      </Card>
   )
}

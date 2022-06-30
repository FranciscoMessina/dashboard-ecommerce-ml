import { Paper, Group, Divider, Button, Checkbox, Text, Badge, useMantineTheme, Stack } from '@mantine/core'
import React, { useMemo } from 'react'
import { Order, SaleChannel, SearchStatus } from '../../types/types'

import { FoundStatusButton, OrderItemInfo, OrderOptions } from './'

interface CartOrderDisplayProps {
   order: Order
}

export const CartOrderDisplay: React.FC<CartOrderDisplayProps> = ({ order }) => {
   const amountOfProducts = useMemo(
      () => order.items.reduce((prev, curr) => prev + curr.quantity, 0),
      [order]
   )

   const theme = useMantineTheme()

   let borderColor

   switch (order.searchStatus) {
      case SearchStatus.Pending:
         borderColor = theme.colors.yellow[5]
         break
      case SearchStatus.NotFound:
         borderColor = theme.colors.red[5]
         break
      case SearchStatus.Found:
         borderColor = theme.colors.blue[5]
         break
      default:
         borderColor = theme.colors.green[5]
         break
   }


   let saleChannel;
   let badgeColor;

   switch (order.saleChannel) {
      case SaleChannel.LOCAL:
         saleChannel = 'local';
         badgeColor = ''
         break;
      case SaleChannel.ML:
         saleChannel = 'ml'
         badgeColor = '#ffeb10'

         break;
      case SaleChannel.MS:
         saleChannel = 'ms'
         badgeColor = '#e53c8f'

         break;
      case SaleChannel.SHOP:
         saleChannel = 'shop';
         badgeColor = '#38b000'

         break;
   }




   return (
      <Paper shadow="lg" sx={{ width: '100%', borderLeft: `${borderColor} 3px solid` }}>
         <Group position="apart" px="sm" py="md">
            <Group align="center">
               <Checkbox size="xs" radius="xs" aria-label="Seleccionar venta" />
               <Badge sx={{ backgroundColor: badgeColor, color: 'black' }} variant='filled' size='xs'>{saleChannel}</Badge>

               <Text weight={600}>#{order.cartId} </Text>
               <Divider orientation="vertical" size="xs" style={{ height: '20px' }} my={4} />

               <Text size="sm" sx={{ fontStyle: 'italic' }}>
                  {new Date(order.createdAt).toLocaleDateString('es-AR', {
                     day: 'numeric',
                     month: 'long',
                     year: 'numeric',
                     minute: 'numeric',
                     hour: 'numeric'
                  })}
               </Text>


            </Group>

            <Group p={0}>

               {order.searchStatus === SearchStatus.Found && <FoundStatusButton order={order} />}
               <OrderOptions order={order} />

            </Group>
         </Group>

         <Divider mb={6} p={0} />
         <Group px="xs" position="apart" py={6} align='flex-start'>
            <Stack>
               {order.items.map(item => (
                  <OrderItemInfo item={item} key={item.id} />
               ))}
            </Stack>

            <Group direction="column" align={'end'} p='sm'>
               <Group direction="column" spacing={2}>
                  <span>{`${order.buyer.first_name} ${order.buyer.last_name}`}</span>
                  <span>{order.buyer.nickname}</span>
               </Group>
               <Button component="a" size="xs" href="#random" variant="subtle">
                  Ver mensajes
               </Button>
            </Group>
         </Group>
      </Paper>
   )
}

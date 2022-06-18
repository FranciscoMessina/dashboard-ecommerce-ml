import { Paper, Group, Divider, Button, Checkbox, Text } from '@mantine/core'
import React, { useMemo } from 'react'
import { Order } from '../../types/types'

import { OrderItemInfo } from './'

interface CartOrderDisplayProps {
   order: Order
}

export const CartOrderDisplay: React.FC<CartOrderDisplayProps> = ({ order }) => {
   const amountOfProducts = useMemo(
      () => order.items.reduce((prev, curr) => prev + curr.quantity, 0),
      [order]
   )

   console.log(amountOfProducts)

   return (
      <Paper shadow="lg" sx={{ width: '100%' }}>
         <Group position="apart" px="sm" py={6}>
            <Group align="center">
               <Checkbox size="xs" radius="xs" aria-label="Seleccionar venta" />

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

            <Group>
               <Button
                  component="a"
                  variant="outline"
                  size="sm"
                  href={`https://www.mercadolibre.com.ar/ventas/${order.cartId}/detalle`}
                  target="_blank"
                  rel="noreferrer noopener"
               >
                  Ver detalle
               </Button>
               <Button component="a" size="sm" href={`#`}>
                  Entregar
               </Button>
            </Group>
         </Group>

         <Divider mb={6} p={0} />
         <Group px="xs" position="apart" py={6}>
            <OrderItemInfo order={order} />

            <Group direction="column" align={'end'}>
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

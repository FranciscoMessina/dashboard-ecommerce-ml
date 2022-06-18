import {
   Center,
   Container,
   Group,
   Loader, Text,
   TextInput,
   UnstyledButton,
   useMantineTheme
} from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { Adjustments, Search } from 'tabler-icons-react'
import { CartOrderDisplay } from '../components/ui'
import { OrderDisplay } from '../components/ui'
import { useOrdersQuery } from '../hooks/useOrdersQuery'

export default function Sales() {
   const theme = useMantineTheme()

   const ordersQuery = useOrdersQuery({})

   useDocumentTitle('Ventas')

   // console.log(ordersQuery.data)

   if (ordersQuery.isLoading) {
      return (
         <Center>
            <Loader />
         </Center>
      )
   }

   if (ordersQuery.isError) {
      return <div> Error: {ordersQuery.error.message}</div>
   }

   return (
      <Container size={1800}>
         <Group direction="column" spacing="xl" sx={{ width: '100%' }}>
            <Group sx={{ width: '100%' }}>
               <UnstyledButton
                  p="sm"
                  sx={(theme) => ({
                     borderRadius: 4,
                     '&:hover': {
                        backgroundColor:
                           theme.colorScheme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.1)'
                     }
                  })}
               >
                  <Group>
                     <Adjustments size={20} color={theme.colors.gray[6]} />
                     <Text size="sm">Filtrar y ordenar</Text>
                  </Group>
               </UnstyledButton>
               <TextInput
                  placeholder="Buscar ventas"
                  radius="lg"
                  variant="filled"
                  styles={(theme) => ({
                     input: {
                        backgroundColor: theme.colorScheme === 'light' ? 'white' : theme.colors.dark[6]
                     }
                  })}
                  size="xs"
                  icon={<Search size={16} />}
               />
            </Group>

            {ordersQuery.data?.data.results.map((order) => {
               if (order.cartId) {
                  return <CartOrderDisplay order={order} key={order.id} />
               } else {
                  return <OrderDisplay order={order} key={order.id} />
               }
            })}
         </Group>
      </Container>
   )
}

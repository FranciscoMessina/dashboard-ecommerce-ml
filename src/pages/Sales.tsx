import {
  ActionIcon,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'

import { Adjustments, Search } from 'tabler-icons-react'
import { Layout } from '../components/Layout'
import OrderDisplay from '../components/OrderDisplay'
import { useOrdersQuery } from '../hooks/useOrdersQuery'
import { MeliCompleteOrderData } from '../types/types'

export default function Sales() {
  const theme = useMantineTheme()

  const ordersQuery = useOrdersQuery({})

  useDocumentTitle('Ventas - El Rio Libros')

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
    <Container>
      <Center>
        <Group direction="column" spacing={25}>
          <Paper p="md" radius="sm" shadow="sm" sx={{ width: '100%' }}>
            <Group>
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
                size="xs"
                icon={<Search size={16} />}
              />
            </Group>
          </Paper>
          {ordersQuery.data?.data.results.map((order: MeliCompleteOrderData) => (
            <OrderDisplay order={order} key={order.id} />
          ))}
        </Group>
      </Center>
    </Container>
  )
}

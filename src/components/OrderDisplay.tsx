import { Box, Button, Checkbox, Divider, Group, Paper, Text, useMantineTheme } from '@mantine/core'
import { SearchStatus } from '../types/types.js'

import OrderItemInfo from './OrderItemInfo'
import { OrderOptions } from './OrderOptions.js'
import { FoundStatusButton } from './FoundStatusButton'

function OrderDisplay({ order }: any) {
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

  return (
    <Paper shadow="lg" sx={{ width: '100%', borderLeft: `${borderColor} 3px solid` }}>
      <Group position="apart" px="sm" py="md">
        <Group align="center" p={0}>
          <Checkbox size="xs" radius="xs" aria-label="Seleccionar venta" />

          <Text weight={600}>#{order.meliOrderIds[0]} </Text>
          <Divider orientation="vertical" size="xs" style={{ height: '20px' }} my={4} />

          <Text size="sm" sx={{ fontStyle: 'italic' }}>
            {new Date(order.createdAt).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              minute: 'numeric',
              hour: 'numeric'
            })}{' '}
            Esto esta mal
          </Text>
        </Group>

        <Group p={0}>
          {order.searchStatus === SearchStatus.Found && <FoundStatusButton order={order} />}
          <OrderOptions order={order} />
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

export default OrderDisplay

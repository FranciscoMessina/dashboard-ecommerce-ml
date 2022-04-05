import { Button, Checkbox, Divider, Group, Paper, Text } from '@mantine/core'
import OrderItemInfo from './OrderItemInfo'

function OrderDisplay({ order }: any) {
  return (
    <Paper
      shadow="lg"
      sx={(theme) => ({
        minWidth: '70vw',
        maxWidth: '1280px',
        width: '100%'
      })}
    >
      <Group position="apart" sx={(theme) => ({})} px="sm" py={6}>
        <Group>
          <Checkbox size="xs" radius="xs" aria-label="Seleccionar venta" />
          <Text weight={600}>#{order.id} </Text>-
          <Text size="sm" sx={{ fontStyle: 'italic' }}>
            {new Date(order.date_created).toLocaleDateString('es-AR', {
              day: 'numeric',
              month: 'short',
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
            href={`https://www.mercadolibre.com.ar/ventas/${order.id}/detalle`}
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
            <span>{`${order.buyer.firstName} ${order.buyer.last_name}`}</span>
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

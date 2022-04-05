import { Anchor, Box, Group, Image, Text } from '@mantine/core'

function OrderItemInfo({ order }: any) {
  return (
    <Group>
      <Box sx={(theme) => ({ position: 'relative' })}>
        <Image
          src={order.order_items[0].item.thumbnail}
          alt={order.order_items[0].item.title}
          fit="contain"
          height={90}
          width={90}
          withPlaceholder
          radius="xs"
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: order.order_items[0].item.condition === 'new' ? '#7950f2' : '#4dabf7',
            paddingInline: '3px',
            paddingBlock: 0,
            borderRadius: '0 0 5px  0'
          }}
        >
          <Text size="xs" weight={600} color="#fff" transform="uppercase">
            {order.order_items[0].item.condition === 'new' ? 'nuevo' : 'usado'}
          </Text>
        </Box>
      </Box>
      <div className="mt-4 flex flex-col gap-3 self-start text-xs text-gray-500 lg:text-sm">
        <Anchor
          href={`${order.order_items[0].item.permalink}?redirectedFromSimilar=true`}
          className="hover:underline"
          target="_blank"
          rel="noreferrer"
        >
          {order.order_items[0].item.title}
        </Anchor>
        <div className="flex items-center justify-between gap-3">
          <span className="">Precio - ${order.order_items[0].item.price}</span>
          <div>
            <span className=" font-bold">{order.order_items[0].quantity} </span>
            <span>u.</span>
          </div>
        </div>
        <span>SKU: {order.order_items[0].item.seller_sku}</span>
      </div>
    </Group>
  )
}

export default OrderItemInfo

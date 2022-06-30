import { Anchor, Box, Group, Image, Stack, Text } from '@mantine/core'

export function OrderItemInfo({ item }: any) {
   return (
      <Group align='flex-start'>
         <Box sx={(theme) => ({ position: 'relative' })}>
            <Image
               src={item.secure_thumbnail}
               alt={item.title}
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
                  backgroundColor: item.condition === 'new' ? '#7950f2' : '#4dabf7',
                  paddingInline: '3px',
                  paddingBlock: 0,
                  borderRadius: '0 0 5px  0'
               }}
            >
               <Text size="xs" weight={600} color="#fff" transform="uppercase">
                  {item.condition === 'new' ? 'nuevo' : 'usado'}
               </Text>
            </Box>
         </Box>
         <Stack spacing='xs'>
            <Anchor
               href={`${item.permalink}?redirectedFromSimilar=true`}
               className="hover:underline"
               target="_blank"
               rel="noreferrer"

            >
               {item.title}
            </Anchor>
            <Group>
               <span className="">Precio - ${item.price}</span>
               <div>
                  <span className=" font-bold">{item.quantity} </span>
                  <span>u.</span>
               </div>
            </Group>
            <span>SKU: {item.seller_sku || ''}</span>
         </Stack>
      </Group>
   )
}


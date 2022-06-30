import { Badge, Button, Card, Center, Container, Group, Image, Loader, Paper, Stack, Text, Title } from '@mantine/core'
import { useDocumentTitle } from '@mantine/hooks'
import { AxiosError, AxiosResponse } from 'axios'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Plus } from 'tabler-icons-react'
import { CreateQuickItemModal } from '../components/ui'

import { useAxiosInstance } from '../hooks'
import { MeliItem } from '../types/types'

export const ItemsPage = () => {
   useDocumentTitle('Publicaciones')
   const axios = useAxiosInstance()
   const [showQuickPublicationModal, setShowQuickPublicationModal] = useState(false)
   const queryResult = useQuery<AxiosResponse, AxiosError>('items', () => axios.get('/meli/items'), {
      retry: false
   })

   console.log(queryResult.data?.data)

   if (queryResult.isLoading) {
      return <Loader />
   }



   return (
      <>
         <Container fluid>

            <Group position='apart'>
               <Title order={2}>Publicaciones </Title>
               <Group>
                  <Button> Nueva publicación</Button>
                  <Button size='sm' onClick={() => setShowQuickPublicationModal(true)}><Plus /> </Button>
               </Group>
            </Group>


            <Stack mt='md'>
               {queryResult.isSuccess && queryResult.data.data.results.map((item: MeliItem) => (
                  <Card key={item.id}>
                     <Group align='flex-start'>
                        <Image src={item.secure_thumbnail} width={100} radius='sm' />
                        <Stack spacing='sm'>
                           <Text size='xs' color='dimmed'>#{item.id.split('MLA')[1]}</Text>
                           <Text size='sm' weight='bold'>{item.title}</Text>
                           <Group spacing='sm'>
                              {item.channels.includes('marketplace') && (
                                 <Badge
                                    size='xs'
                                    variant='filled'
                                    sx={{ color: 'black', backgroundColor: '#ffeb10' }}
                                 >
                                    ML
                                 </Badge>
                              )}
                              {item.channels.includes('mshops') && (
                                 <Badge
                                    size='xs'
                                    color='grape'
                                    variant='filled'
                                    sx={{ backgroundColor: '#e53c8f' }}
                                 >
                                    MS
                                 </Badge>
                              )}
                           </Group>
                           <Text size='xs' color='dimmed'>{item.available_quantity > 0 ? `${item.available_quantity} unidad/es` : 'Sin stock'}</Text>

                        </Stack>
                     </Group>

                  </Card>
               ))}
            </Stack>

         </Container>
         <CreateQuickItemModal opened={showQuickPublicationModal} close={() => setShowQuickPublicationModal(false)} />
      </>
   )
}

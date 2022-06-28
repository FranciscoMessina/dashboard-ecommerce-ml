import { ActionIcon, Button, Center, Checkbox, Container, Group, Loader, Modal, NumberInput, Paper, Select, Space, Text, TextInput, Title, useMantineTheme } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useBooleanToggle, useClipboard, useDocumentTitle } from '@mantine/hooks'
import { useModals } from '@mantine/modals'
import { useState } from 'react'
import { Checks, Plus, TruckDelivery } from 'tabler-icons-react'
import { sleep } from '../helpers'
import { useAxiosInstance } from '../hooks'
import { Clipboard } from 'tabler-icons-react'
import { TextWithCopyBtn } from '../components/ui'
import { useQuery } from 'react-query'
import { QuickPublicationModal } from '../components/ui/QuickPublicationModal'

export default function Publicator() {
   useDocumentTitle('Publicar')
   const modals = useModals()
   const [showQuickPublicationModal, setShowQuickPublicationModal] = useState(false)
   const [data, setData] = useState({
      isbn: '',
      title: '',
      publisher: '',
      publishedDate: '',
      pageCount: '',
      authors: ['', ''],
      language: '',
      bookTitle: '',
      price: 0,
      genre: '',
      subgenre: '',
      cover: '',
      stock: 1,
      accesories: '',
      height: '',
      width: '',
      pocket: false,
      maxAge: '',
      minAge: '',
      narrationType: '',
      coloring: false,
      channels: ['marketplace', 'mshops']
   })




   return (
      <>
         <Container fluid>
            <Paper p="md" mb="xl" shadow="sm">
               <Group position='apart'>
                  <Title order={2}>Publicar </Title>
                  <Group>
                     <Button> Nueva publicación</Button>
                     <Button size='sm' onClick={() => setShowQuickPublicationModal(true)}><Plus /> </Button>
                  </Group>
               </Group>
            </Paper>
            <Paper p="md" shadow="sm">
               <Center>
                  <Group>
                  </Group>
               </Center>
            </Paper>
         </Container>
         <QuickPublicationModal opened={showQuickPublicationModal} close={() => setShowQuickPublicationModal(false)} />
      </>
   )
}


import { ActionIcon, Button, Center, Checkbox, Container, Group, Modal, NumberInput, Paper, Space, Text, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useBooleanToggle, useClipboard, useDocumentTitle } from '@mantine/hooks'
import { useModals } from '@mantine/modals'
import { useState } from 'react'
import { Checks, Plus } from 'tabler-icons-react'
import { sleep } from '../helpers'
import { useAxiosInstance } from '../hooks'
import { Clipboard } from 'tabler-icons-react'

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

interface ModalProps {
   opened: boolean
   close: () => void
}


export const QuickPublicationModal: React.FC<ModalProps> = ({ opened, close }) => {
   const axios = useAxiosInstance()
   const modals = useModals()
   const clipboardMl = useClipboard({ timeout: 1000 })
   const clipboardMs = useClipboard({ timeout: 1000 })
   const [isSubmitting, setIsSubmitting] = useState(false)
   const form = useForm({
      initialValues: {
         title: '',
         price: 100,
         free_shipping: false,
         ml: true,
         ms: true
      }
   })



   const handleSubmit = async (values: typeof form.values) => {
      setIsSubmitting(true)
      const channels = []
      if (values.ml) {
         channels.push('Mercado Libre')
      }

      if (values.ms) {
         channels.push('Mercado Shops')
      }



      try {
         console.log(values);
         const res = await axios.post('meli/items/quick', {
            title: values.title,
            price: values.price,
            free_shipping: values.free_shipping,
            channels,
         })
         console.log(res);

         const mlLink = res.data.permalink

         const clipboardMlIcon = <ActionIcon
            color={clipboardMl.copied ? 'green' : 'gray'}

            onClick={() => clipboardMl.copy(mlLink)}
         >
            {clipboardMl.copied ?
               <Checks size={18} />
               :
               <Clipboard size={18} />
            }
         </ActionIcon>

         const msLink = res.data.permalink.replace('articulo.mercadolibre.com.ar', 'elriolibros.mercadoshops.com.ar')

         const clipboardMsIcon = <ActionIcon
            color={clipboardMs.copied ? 'green' : 'gray'}

            onClick={() => clipboardMs.copy(msLink)}
         >
            {clipboardMs.copied ?
               <Checks size={18} />
               :
               <Clipboard size={18} />
            }
         </ActionIcon>
         close()
         // await sleep(2000)
         modals.openModal({
            title: values.title,
            centered: true,
            children: <>
               <TextInput value={mlLink} readOnly size='xs' rightSection={clipboardMlIcon} />
               <Space my='sm' />
               <TextInput value={msLink} readOnly size='xs' rightSection={clipboardMsIcon} />
            </>
         })

      } catch (err) {
         console.log(err);

      } finally {
         setIsSubmitting(false)
      }
   }

   return (
      <Modal
         opened={opened}
         onClose={() => {
            form.reset();
            close()
         }}
         title='Nueva publicación rapida'
         centered
         closeOnClickOutside={!isSubmitting}
      >
         <form onSubmit={form.onSubmit(handleSubmit)}>
            <Group position='apart' m={0} p={0}>

               <TextInput
                  label='Titulo'
                  maxLength={60}
                  {...form.getInputProps('title')}
               />
               <NumberInput
                  hideControls
                  label='Precio'
                  min={100}
                  {...form.getInputProps('price')}
               />
               <Group>


                  <Checkbox
                     label='Envio gratis'
                     {...form.getInputProps('free_shipping', { type: 'checkbox' })}
                  />
                  <Checkbox
                     label='Meli'
                     color='yellow'
                     {...form.getInputProps('ml', { type: 'checkbox' })}
                  />

                  <Checkbox
                     color='grape'
                     label='Mshop'
                     {...form.getInputProps('ms', { type: 'checkbox' })}
                  />
               </Group>


            </Group>
            <Space mt='sm' />
            <Button
               loading={isSubmitting}
               disabled={isSubmitting}
               fullWidth
               type='submit'
            >
               Crear
            </Button>

         </form>
      </Modal>)
}


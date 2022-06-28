import { useMantineTheme, Modal, Group, TextInput, NumberInput, Center, Button, Loader, Space, Select, Checkbox, Text } from "@mantine/core"
import { useForm } from "@mantine/form"
import { useModals } from "@mantine/modals"
import { useState } from "react"
import { useQuery } from "react-query"
import { TruckDelivery } from "tabler-icons-react"
import { useAxiosInstance } from "../../hooks"
import { TextWithCopyBtn } from "./TextWithCopyBtn"

interface ModalProps {
   opened: boolean
   close: () => void
}


export const QuickPublicationModal: React.FC<ModalProps> = ({ opened, close }) => {
   const theme = useMantineTheme()
   const axios = useAxiosInstance()
   const modals = useModals()
   const [isSubmitting, setIsSubmitting] = useState(false)
   const form = useForm({
      initialValues: {
         title: '',
         price: 100,
         free_shipping: false,
         ml: true,
         ms: true,
         category: 'MLA3025',
         subCategory: '',
      }
   })

   const catQuery = useQuery('categories', async () => axios.get('meli/categories'), {
      enabled: opened
   })

   const subCatQuery = useQuery(`categories-${form.values.category}`, async () => axios.get(`meli/categories/${form.values.category}`), {
      enabled: !!form.values.category && opened
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
            ...values,
            channels,
         })
         console.log(res);

         const mlLink = res.data.permalink

         const msLink = res.data.permalink.replace('articulo.mercadolibre.com.ar', 'elriolibros.mercadoshops.com.ar')

         close()
         modals.openModal({
            title: `Links para: ${values.title}`,
            centered: true,
            children: <>
               <TextWithCopyBtn text={mlLink} />
               <Space my='sm' />
               <TextWithCopyBtn text={msLink} />
            </>
         })

      } catch (err) {
         console.log(err);

      } finally {
         form.reset()
         setIsSubmitting(false)
         close()
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
         {catQuery.isSuccess && (
            <form onSubmit={form.onSubmit(handleSubmit)}>
               <Group position='apart' m={0} p={0}>
                  <Select
                     label='Categoria'
                     sx={{ width: '100%' }}
                     data={catQuery.data?.data.map((data: any) => ({ value: data.id, label: data.name }))}
                     searchable
                     {...form.getInputProps('category')}
                  />

                  {subCatQuery.isSuccess && (
                     <Select
                        label='Sub Categoria'
                        sx={{ width: '100%' }}
                        data={subCatQuery.data?.data?.map((data: any) => ({ value: data.id, label: data.name }))}
                        searchable
                        {...form.getInputProps('subCategory')}
                     />
                  )}

                  <Group noWrap sx={{ width: '100%' }}>
                     <TextInput
                        label='Titulo'
                        sx={{ width: '100%' }}
                        maxLength={60}
                        {...form.getInputProps('title')}
                     />
                     <NumberInput
                        sx={{ width: 100 }}
                        hideControls
                        label='Precio'
                        min={100}
                        {...form.getInputProps('price')}
                     />
                  </Group>
                  <Group>
                     <Checkbox
                        label={<Center><TruckDelivery color={theme.colors.green[6]} size={18} /></Center>}
                        {...form.getInputProps('free_shipping', { type: 'checkbox' })}
                     />
                     <Checkbox
                        label="ML"
                        color='yellow'
                        {...form.getInputProps('ml', { type: 'checkbox' })}
                     />

                     <Checkbox
                        color='grape'
                        label='MS'
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
         )}
         {catQuery.isLoading && (
            <Center>
               <Loader />
            </Center>
         )}
         {catQuery.isError && (
            <Center>
               <Text color='red' >Something went wrong</Text>
            </Center>
         )}
      </Modal>)
}


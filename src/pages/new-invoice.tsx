import { Button, Container, Divider, Group, Paper, Space, Stack, Text, TextInput, Title } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { FormList, formList, useForm } from '@mantine/form'
import { randomId, useDocumentTitle } from '@mantine/hooks'
import 'dayjs/locale/es'
import { Link } from 'react-router-dom'
import { InvoiceProduct } from '../components/ui'
import { useAxiosInstance } from '../hooks'
import { SaleChannel } from '../types/types'

interface FormValues {
   client: string;
   date: Date;
   products: FormList<{
      id?: string | number;
      title: string;
      price: number;
      quantity: number;
      key: string;
   }>
}


export default function NewInvoice() {
   useDocumentTitle('Nueva Venta')
   const axios = useAxiosInstance()

   const form = useForm<FormValues>({
      initialValues: {
         client: '',
         date: new Date(),
         products: formList([{ id: '', title: '', price: 0, quantity: 1, key: randomId() }]),
      },
   })


   const onSubmit = async (values: FormValues) => {
      console.log(values)

      try {
         const response = await axios.post('/orders', {
            ...values,
            saleChannel: SaleChannel.LOCAL,
            emitInvoice: true
         })
         console.log(response);

      } catch (err) {
         console.log(err);

      }

   }

   const save = async () => {

      try {
         const response = await axios.post('/orders', {
            ...form.values,
            saleChannel: SaleChannel.LOCAL,
            emitInvoice: false
         })
         console.log(response);

      } catch (err) {
         console.log(err);

      }


   }


   return (
      <Container fluid>
         <form onSubmit={form.onSubmit(onSubmit)}>

            <Paper p='sm'>
               <Group position='apart'>
                  <Title order={2}>Nueva Factura</Title>
                  <Group >
                     <Button color='gray' component={Link} to='/invoices'>
                        Cancelar
                     </Button>

                     <Button onClick={save}>
                        Guardar
                     </Button>

                     <Button type='submit' color='green'>
                        Emitir
                     </Button>
                  </Group>
               </Group>
            </Paper>
            <Space my='md' />
            <Paper p="md" mb="xl" shadow="sm">

               <Group grow>
                  <TextInput label='Cliente' defaultValue='Sin identificar' />
                  <DatePicker
                     locale='es'
                     label='Fecha'
                     defaultValue={new Date()}
                     inputFormat='DD/MM/YYYY'
                     clearable={false}
                  />
               </Group>
               <Divider my='md' />

               <Group position='apart'>
                  <Group align='center'>
                     <Text size='xl' > Productos:</Text>
                     <Text size='xl' weight='bold'>$ {form.values.products.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Text>
                  </Group>
                  <Button
                     onClick={() => {
                        form.addListItem('products', {
                           id: '',
                           title: '',
                           quantity: 1,
                           price: 0,
                           key: randomId()
                        })
                     }}>
                     Agregar producto
                  </Button>
               </Group>
               <Stack>
                  {form.values.products.map((field, index) => (
                     <InvoiceProduct
                        key={field.key}
                        index={index}
                        form={form}
                     />
                  ))}
               </Stack>

            </Paper>
         </form>
      </Container>
   )
}

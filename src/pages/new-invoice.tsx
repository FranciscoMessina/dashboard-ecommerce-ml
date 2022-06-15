import { Autocomplete, Box, Button, Card, Center, Collapse, Container, Divider, Group, NumberInput, Paper, Space, Stack, Text, TextInput, Title } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { randomId, useDocumentTitle } from '@mantine/hooks'
import { useState } from 'react'
import { Car, CurrencyDollar, FileInvoice } from 'tabler-icons-react'
import { Invoice, ProductAutocomplete } from '../components/ui'
import 'dayjs/locale/es'
import { InvoiceProduct } from '../components/ui'
import { FormProvider, useFieldArray, useForm as useReactHookForm } from 'react-hook-form'
import { FormList, formList, useForm } from '@mantine/form'

interface FormValues {
   client: string;
   date: Date;
   products: FormList<{
      title: string;
      price: number;
      quantity: number;
      key: string;
   }>
}


export default function NewInvoice() {
   useDocumentTitle('Nueva Venta')

   // Mantine Form
   const form = useForm<FormValues>({
      initialValues: {
         client: '',
         date: new Date(),
         products: formList([{ title: '', price: 0, quantity: 1, key: randomId() }]),
      }
   })

   // const methods = useReactHookForm<FormValues>({
   //    defaultValues: {
   //       client: 'Sin identifica',
   //       date: new Date(),
   //       products: [{ title: '', price: 0, quantity: 1 }]
   //    }
   // })
   // const { register, handleSubmit, control, watch, setValue, getValues } = methods
   // const { fields, append, remove } = useFieldArray({
   //    control,
   //    name: 'products'
   // })

   // const watchProductsArray = watch('products')
   // const controlledFields = fields.map((field, index) => {
   //    return { ...field, ...watchProductsArray[index] }
   // })

   const onSubmit = (values: FormValues) => {
      console.log(values)
   }


   return (
      <Container fluid>
         <Paper p='sm'>
            <Group position='apart'>
               <Title order={2}>Nueva Factura</Title>
               <Group >
                  <Button color='gray'>
                     Cancelar
                  </Button>

                  <Button>
                     Guardar
                  </Button>
               </Group>
            </Group>
         </Paper>
         <Space my='md' />
         <Paper p="md" mb="xl" shadow="sm">
            {/* <FormProvider {...methods}> */}
            <form onSubmit={form.onSubmit(onSubmit)}>
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
                  <Text size='xl' > Productos:</Text>
                  <Button onClick={() => {
                     // @ts-ignore
                     form.addListItem('products', { title: '', quantity: 1, price: 0, key: randomId() })
                  }}>Agregar producto</Button>
               </Group>
               <Stack>
                  {form.values.products.map((field, index) => (
                     <InvoiceProduct
                        key={field.key}
                        index={index}
                        field={field}
                        form={form}
                     />
                  ))}
               </Stack>

            </form>
            {/* </FormProvider> */}
         </Paper>
      </Container>
   )
}

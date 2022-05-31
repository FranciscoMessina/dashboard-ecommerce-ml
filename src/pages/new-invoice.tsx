import { Autocomplete, Box, Button, Card, Center, Collapse, Container, Divider, Group, NumberInput, Paper, Space, Stack, Text, TextInput, Title } from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { useDocumentTitle } from '@mantine/hooks'
import { useState } from 'react'
import { Car, CurrencyDollar, FileInvoice } from 'tabler-icons-react'
import { Invoice } from '../components/ui'
import 'dayjs/locale/es'
import { InvoiceProduct } from '../components/ui/InvoiceProduct'
import { useFieldArray, useForm } from 'react-hook-form'

interface FormValues {
   client: string;
   date: string;
   products: {
      title: string;
      price: number;
      quantity: number;
   }[]
}


export default function NewInvoice() {
   useDocumentTitle('Nueva Venta')

   const { register, handleSubmit, control, watch, setValue, getValues } = useForm<FormValues>()
   const { fields, append, remove } = useFieldArray({
      control,
      name: 'products'
   })

   const watchProductsArray = watch('products')
   const controlledFields = fields.map((field, index) => {
      return { ...field, ...watchProductsArray[index] }
   })

   const onSubmit = (values: FormValues) => {
      console.log(values)
   }


   return (
      <Container fluid>
         <Paper p="md" mb="xl" shadow="sm">
            <form onSubmit={handleSubmit(onSubmit)}>
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
                     append({ quantity: 1, price: 0})
                  }}>Agregar producto</Button>
               </Group>
               <Stack>
                  {controlledFields.map((field, index) => (
                     <InvoiceProduct
                        key={field.id}
                        index={index}
                        field={field}
                        register={register}
                        remove={remove}
                        setValue={setValue}
                        getValues={getValues}
                        watch={watch}
                     />
                  ))}
               </Stack>
            </form>
         </Paper>
      </Container>
   )
}

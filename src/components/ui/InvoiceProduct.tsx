import { Group, Text, TextInput, NumberInput, ActionIcon, Autocomplete, Loader, Avatar, MantineColor, SelectItemProps, createStyles } from '@mantine/core'
import { FormList } from '@mantine/form';
import { UseFormReturnType } from '@mantine/form/lib/use-form';
import { useDebouncedValue, useSetState } from '@mantine/hooks';
import React, { forwardRef, useDebugValue, useEffect, useState } from 'react'
import { FormProvider, useForm, UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormWatch, useWatch } from 'react-hook-form';
import { CurrencyDollar, Trash } from 'tabler-icons-react'
import { ProductAutocomplete } from '.';
import { useSearchMLItemQuery } from '../../hooks';

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


interface Props {
   field: {
      title: string;
      price: number;
      quantity: number;
      key: string;
   }
   index: number
   form: UseFormReturnType<FormValues>
   // register: UseFormRegister<FormValues>
   // setValue: UseFormSetValue<FormValues>
   // getValues: UseFormGetValues<FormValues>
   // watch: UseFormWatch<FormValues>
   // remove: any
}

const useStyles = createStyles((theme, _params, getRef) => ({
   numberInput: {

   }
}))


export const InvoiceProduct = ({ index, field, form }: Props) => {



   // const price = watch(`products.${index}.price`)
   // const quantity = watch(`products.${index}.quantity`)


   return (
      <Group noWrap align='end' position='apart'>

         <ProductAutocomplete index={index} form={form} />
         <Group>
            <NumberInput
               label='Cantidad'
               hideControls
               sx={{ maxWidth: '70px' }}
               defaultValue={1}
               {...form.getListInputProps('products', index, 'quantity')}
            // {...register(`products.${index}.quantity`)}
            />
            <NumberInput
               // {...register(`products.${index}.price`)}
               {...form.getListInputProps('products', index, 'price')}
               sx={{ maxWidth: '120px' }}
               hideControls
               label='Precio'
               // @ts-expect-error
               parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
               formatter={(value) =>
                  // @ts-expect-error
                  !Number.isNaN(parseFloat(value))
                     ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                     : ''
               }
               icon={<CurrencyDollar size='18' />}
            />
            <NumberInput
               noClampOnBlur
               icon={<CurrencyDollar size='18' />}
               disabled
               value={form.values.products[index].price * form.values.products[index].quantity}
               label='Total'
               // @ts-expect-error
               parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
               formatter={(value) =>
                  // @ts-expect-error
                  !Number.isNaN(parseFloat(value))
                     ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                     : ''
               }
               sx={{ maxWidth: '120px' }}
            />
         </Group>
         <ActionIcon size='lg' onClick={() => form.removeListItem('products', index)}>
            <Trash />
         </ActionIcon>

      </Group>
   )
}



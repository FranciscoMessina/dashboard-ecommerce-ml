import { Group, TextInput, NumberInput, ActionIcon } from '@mantine/core'
import React from 'react'
import { UseFormGetValues, UseFormRegister, UseFormSetValue, UseFormWatch, useWatch } from 'react-hook-form';
import { CurrencyDollar, Trash } from 'tabler-icons-react'

interface FormValues {
   client: string;
   date: string;
   products: {
      title: string;
      price: number;
      quantity: number;
   }[]
}


interface Props {
   field: any
   register: UseFormRegister<FormValues>
   setValue: UseFormSetValue<FormValues>
   getValues: UseFormGetValues<FormValues>
   watch: UseFormWatch<FormValues>
   index: number
   remove: any
}

export const InvoiceProduct = ({ register, index, remove, setValue, getValues, field, watch }: Props) => {

   const price = watch(`products.${index}.price`)
   const quantity = watch(`products.${index}.quantity`)

   return (
      <Group noWrap align='end' position='apart'>
         <TextInput
            label='Producto'
            sx={{ width: '320px' }}
            {...register(`products.${index}.title`)}
         />
         <Group>
            <NumberInput
               label='Cantidad'
               hideControls
               sx={{ maxWidth: '70px' }}
               {...register(`products.${index}.quantity`)}
            />
            <NumberInput
               {...register(`products.${index}.price`)}
               noClampOnBlur
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
               value={price * quantity}
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
         <ActionIcon size='lg' onClick={() => remove(index)}>
            <Trash />
         </ActionIcon>
      </Group>
   )
}

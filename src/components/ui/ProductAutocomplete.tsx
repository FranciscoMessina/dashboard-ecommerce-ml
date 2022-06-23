import { Combobox } from '@headlessui/react'
import { Paper, TextInput, Transition, ScrollArea, Group, Image, Text, createStyles } from '@mantine/core'
import { FormList } from '@mantine/form'
import { UseFormReturnType } from '@mantine/form/lib/use-form'
import { useDebouncedValue, useMergedRef, useSetState } from '@mantine/hooks'
import { ChangeEvent, useRef, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { getActiveToken } from '../../helpers'
import { useSearchMLItemQuery } from '../../hooks'
import { MeliItem } from '../../types/types'

interface AutocompleteState {
   value: string
   query: string
   results: MeliItem[]
   loading: boolean
}

const useStyles = createStyles((theme, _params, getRef) => ({
   input: {
      width: '100%',
   },
   comboboxOptions: {
      position: 'absolute',
      zIndex: 1000,
      // top: 25,
      left: 0,
      width: '100%',
      paddingBlock: 2,
      margin: 0,
      paddingLeft: 0
   },
   comboboxOption: {
      display: 'flex',
      minWidth: 150,
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'start'
   },
   resultsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      maxHeight: '200px'
   },
   result: {
      display: 'flex',
      minWidth: 150,
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'start'
   },
   active: {
      '&, &:hover': {
         backgroundColor:
            theme.colorScheme === 'dark'
               ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
               : theme.colors[theme.primaryColor][0],
         color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 7]
      }
   }
}))

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
   index: number;
   form: UseFormReturnType<FormValues>
}

export const ProductAutocomplete: React.FC<Props> = ({ index, form }) => {
   const { classes, theme, cx } = useStyles()
   const inputRef = useRef<HTMLInputElement>(null)

   // const {
   //    register,
   //    formState: { errors, isSubmitting },
   //    clearErrors,
   //    setValue
   // } = useFormContext()

   const titleInput = form.getListInputProps('products', index, 'title')



   const mergedRef = useMergedRef(inputRef)

   const [autocomplete, setAutocomplete] = useSetState<AutocompleteState>({
      value: titleInput.value,
      query: '',
      results: [],
      loading: true
   })

   const MlItemsQuery = useSearchMLItemQuery(autocomplete.query, {
      enabled: false
   })

   const searchMlItems = MlItemsQuery.refetch


   const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
      titleInput.onChange(e)

      setAutocomplete({ value: e.target.value, query: e.target.value })

   }

   const [debouncedQuery] = useDebouncedValue(autocomplete.query, 1000, {
      leading: false
   })

   useEffect(() => {
      if (!autocomplete.query) {
         setAutocomplete({
            loading: true,
            results: []
         })
      }

      if (autocomplete.query.length <= 3) return

      searchMlItems().then((res) => {
         setAutocomplete(() => ({
            results: res?.data?.data.results || [],
            loading: false
         }))
      })

   }, [debouncedQuery, searchMlItems])

   const handleChange = (data: any) => {
      form.setListItem(`products`, index, { title: data.title, price: data.price, quantity: 1, key: data.id })

   }

   return (
      <div style={{ position: 'relative', width: '100%', maxWidth: '500px' }}>
         <Combobox onChange={handleChange} value={autocomplete.value}>
            <Combobox.Input
               as={TextInput}
               className={classes.input}
               label='Titulo'
               // {...register(`product.x.title`, {
               //    required: {
               //       value: true,
               //       message: 'Es necesario completar el producto'
               //    }
               // })}
               onChange={handleInput}
               ref={mergedRef}
               sx={{
                  width: '100%',
               }}
            />
            <Combobox.Options
               className={classes.comboboxOptions}
            >
               <Paper
                  component={ScrollArea}
                  shadow="md"
                  radius="xs"
                  m={0}
                  scrollbarSize={1}
                  offsetScrollbars
                  sx={(theme) => ({
                     height: 55 * autocomplete.results.length,
                     maxHeight: 160
                  })}>
                  {autocomplete.results.map((item, index) => (
                     <Combobox.Option value={item} key={item.id}>
                        {({ active }) => (
                           <Group
                              noWrap
                              p={4}
                              className={cx(classes.result, {
                                 [classes.active]: active
                              })}

                           >
                              <Image
                                 src={item.secure_thumbnail}
                                 alt={item.title}
                                 fit="contain"
                                 sx={(theme) => ({
                                    width: '3rem',
                                    height: '3rem'
                                 })}
                              />

                              <Group direction="column" spacing={2}>
                                 <Text size="sm">{item.title}</Text>
                                 <Text size="sm">${item.price}</Text>
                              </Group>
                           </Group>
                        )}
                     </Combobox.Option>
                  ))}
               </Paper>
            </Combobox.Options>
         </Combobox>
      </div>

   )
}


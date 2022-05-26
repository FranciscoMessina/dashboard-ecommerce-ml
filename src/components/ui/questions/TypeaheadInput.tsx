import { Combobox } from '@headlessui/react'
import {
   Box,
   Center,
   createStyles,
   Group,
   Loader,
   Paper,
   ScrollArea,
   Text,
   Transition
} from '@mantine/core'
import { getHotkeyHandler, mergeRefs, useDebouncedValue, useSetState } from '@mantine/hooks'
import React, { ChangeEvent, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { Checks } from 'tabler-icons-react'
import getCaretCoordinates from 'textarea-caret'
import { getActiveToken } from '../../../helpers'
import { replaceAt } from '../../../helpers/replaceAt.js'
import { useAxiosInstance } from '../../../hooks/useAxiosInstance.js'
import { useSearchMLItemQuery } from '../../../hooks/useSearchMLItemsQuery'
import { useGetQuickAnswersQuery } from '../../../hooks/useGetQuickAnswersQuery'
import { MeliItem, QuickAnswer } from '../../../types/types'
import { AutocompleteMeliItem } from './AutocompleteMeliItem.js'
import { AutocompleteQuickAnswerOption } from './AutocompleteQuickAnswerOption.js'
import { AutocompleteLinkOption } from './AutocompleteLinkOption'

const useStyles = createStyles((theme, _params, getRef) => ({
   comboboxInput: {
      display: 'block',
      width: '100%',
      height: '100px',
      resize: 'none',
      appearance: 'none',
      borderRadius: '2px 0 0 2px',
      border: '2px solid ',
      fontSize: '0.9rem',
      borderColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[3],
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.colors.gray[3],
      padding: '10px',
      borderRight: 0,
      color: theme.colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.gray[8],
      paddingRight: '56px',

      '&:focus': {
         outline: 'none',
         borderColor: theme.colors.blue[7],
         borderWidth: '1px',
         backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0]
      },

      '&::placeholder': { fontStyle: 'italic' },

      '&:disabled': {
         color: theme.colors.gray[8]
      }
   },
   comboboxButton: {
      position: 'absolute',
      right: 0,
      backgroundColor: theme.colors.blue[6],
      border: 0,
      height: '100px',
      paddingInline: '10px',
      cursor: 'pointer'
   },
   comboboxOptions: {
      position: 'absolute',
      zIndex: 1000,
      minWidth: '250px',
      maxHeight: 60,
      paddingBlock: 2
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
   buttonError: {
      backgroundColor: theme.colors.red[6]
   },
   textareaError: {
      borderColor: theme.colors.red[6],
      borderWidth: '1px',

      '&:focus': {
         outline: 'none',
         borderColor: theme.colors.red[6],
         borderWidth: '1px',
         backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0]
      }
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

interface TypeaheadInputProps { }

export const TypeaheadInput: React.FC<TypeaheadInputProps> = ({ }) => {
   const { classes, theme, cx } = useStyles()
   const textareaRef = useRef<HTMLTextAreaElement>(null)
   const submitBtnRef = useRef<HTMLButtonElement>(null)
   const axios = useAxiosInstance()

   // console.log('Rendering')

   const {
      register,
      formState: { errors, isSubmitting },
      clearErrors,
      setValue
   } = useFormContext()

   const answerInput = register('answer', {})

   const mergedRef = mergeRefs(textareaRef, answerInput.ref)

   interface AutocompleteState {
      value: string
      query: string
      results: MeliItem[] | QuickAnswer[] | string[]
      type: 'item' | 'answer' | '' | 'link'
      loading: boolean
   }
   const [autocomplete, setAutocomplete] = useSetState<AutocompleteState>({
      value: '',
      query: '',
      results: [],
      type: '',
      loading: true
   })

   const hotkeyHandler = getHotkeyHandler([
      [
         'mod+enter',
         (e) => {
            console.log(autocomplete)
            if (autocomplete.query || autocomplete.results.length > 0) return

            submitBtnRef.current?.click()
         }
      ]
   ])

   const [query] = useDebouncedValue(autocomplete.query, 600, {
      leading: true
   })

   const MlItemsQuery = useSearchMLItemQuery(query.slice(1), {
      enabled: false
   })

   const searchMlItems = MlItemsQuery.refetch

   const QuickAnswersQuery = useGetQuickAnswersQuery(query.slice(1), {
      enabled: false
   })
   const searchQuickAnswers = QuickAnswersQuery.refetch

   const { top, height, left } = textareaRef.current
      ? getCaretCoordinates(textareaRef.current, textareaRef.current.selectionEnd)
      : { top: 0, height: 0, left: 0 }

   const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
      answerInput.onChange(e)

      setAutocomplete({ value: e.target.value })
      if (!textareaRef.current) return

      const { value, selectionEnd = 0 } = textareaRef.current
      const result = getActiveToken(value, selectionEnd)

      if (!result?.word) return setAutocomplete({ query: '', type: '', results: [] })

      const { word } = result
      if (/^[@#%]\w{0,30}$/.test(word)) {
         const split = word.split('_')

         const joined = split.join(' ')

         setAutocomplete({ query: joined.toLowerCase() })
      }
   }

   useEffect(() => {
      if (!textareaRef.current) return

      const { value, selectionEnd } = textareaRef.current

      const result = getActiveToken(value, selectionEnd || 0)

      if (result?.word.includes('@')) {
         setAutocomplete({ type: 'answer' })
         searchQuickAnswers().then((res) => {
            setAutocomplete(() => ({
               type: 'answer',
               results: res?.data?.data.results || [],
               loading: false
            }))
         })
      } else if (result?.word.includes('#')) {
         setAutocomplete({ type: 'item' })

         if (result.word.length < 4) return

         searchMlItems().then((res) => {
            setAutocomplete(() => ({
               type: 'item',
               results: res?.data?.data.results || [],
               loading: false
            }))
         })
      }
   }, [query, searchMlItems, searchQuickAnswers])

   useEffect(() => {
      if (!textareaRef.current) return

      const { value, selectionEnd } = textareaRef.current

      const result = getActiveToken(value, selectionEnd || 0)

      if (result?.word.includes('%')) {
         setAutocomplete({ type: 'link', loading: false, results: [result.word.slice(1)] })
      }
   }, [autocomplete.query])

   const drop = (e: React.DragEvent<HTMLTextAreaElement>) => {
      if (!textareaRef.current) return

      const { value, selectionEnd } = textareaRef.current
      const data = e.dataTransfer.getData('value')
      const result = getActiveToken(value, selectionEnd || 0)
      const replacement = ` ${data}`

      const newValue = replaceAt(value, replacement, result?.range[1]! + 1).trim() + ' '

      setAutocomplete({
         value: newValue
      })

      textareaRef.current.selectionEnd = result?.range[1]! + replacement.length

      textareaRef.current.focus()
   }

   const dragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
      e.preventDefault()
      e.stopPropagation()
   }

   const resultBoxHeight =
      autocomplete.type === 'item'
         ? autocomplete.results.length * 55
         : autocomplete.results.length * 35

   return (
      <>
         <Box sx={{ position: 'relative', width: '100%' }} mb={12}>
            {/* @ts-ignore */}
            <Combobox
               // @ts-ignore
               onChange={(data) => {
                  if (!textareaRef.current) return

                  const { value, selectionEnd } = textareaRef.current
                  const result = getActiveToken(value, selectionEnd || 0)
                  const replacement = `${data} `

                  const newValue = replaceAt(value, replacement, result?.range[0]!, result?.word.length)

                  setValue('answer', newValue)

                  setAutocomplete({
                     query: '',
                     results: [],
                     type: '',
                     value: newValue,
                     loading: true
                  })

                  textareaRef.current.selectionEnd = result?.range[0]! + replacement.length
                  textareaRef.current.focus()
               }}
               value={autocomplete.value}
               disabled={isSubmitting}
            >
               <Group style={{ width: ' 100%' }}>
                  <Combobox.Input
                     as="textarea"
                     className={cx(classes.comboboxInput, { [classes.textareaError]: errors.answer })}
                     placeholder="Ingresa tu respuesta"
                     maxLength={2000}
                     {...register('answer', {
                        required: {
                           value: true,
                           message: 'No podes enviar una respuesta vacia'
                        }
                     })}
                     onChange={handleInput}
                     name={answerInput.name}
                     onBlur={answerInput.onBlur}
                     ref={mergedRef}
                     onDrop={drop}
                     onDragOver={dragOver}
                     onKeyUp={hotkeyHandler}
                  />
                  <button
                     className={cx(classes.comboboxButton, { [classes.buttonError]: errors.answer })}
                     type="submit"
                     ref={submitBtnRef}
                     onClick={() => {
                        setTimeout(() => clearErrors('answer'), 2800)
                     }}
                  >
                     {isSubmitting ? (
                        <Loader size={32} color="#ffffff" />
                     ) : (
                        <Checks color="white" size={32} />
                     )}
                  </button>

                  <Transition
                     mounted={!!autocomplete.query && autocomplete.results.length > 0}
                     transition="scale-y"
                  >
                     {(styles) => (
                        <Combobox.Options
                           static
                           className={classes.comboboxOptions}
                           style={{
                              top: `${top + height <= 76 ? top : 76}px`,
                              left: left - 35,

                              ...styles
                           }}
                        >
                           <Paper
                              component={ScrollArea}
                              shadow="md"
                              radius="xs"
                              scrollbarSize={1}
                              offsetScrollbars
                              sx={(theme) => ({
                                 height: resultBoxHeight,
                                 maxHeight: 160
                              })}
                           >
                              {autocomplete.results.map((value) => {
                                 if (autocomplete.type === 'item') {
                                    let data = value as MeliItem
                                    return <AutocompleteMeliItem item={data} key={data.id} />
                                 } else if (autocomplete.type === 'answer') {
                                    let data = value as QuickAnswer
                                    return <AutocompleteQuickAnswerOption value={data} key={data.id} />
                                 } else {
                                    return <AutocompleteLinkOption value={autocomplete.query.slice(1)} />
                                 }
                              })}
                           </Paper>
                        </Combobox.Options>
                     )}
                  </Transition>
                  <Transition
                     mounted={!!autocomplete.query && autocomplete.results.length === 0}
                     transition="scale-y"
                  >
                     {(styles) => (
                        <Combobox.Options
                           static
                           className={classes.comboboxOptions}
                           style={{
                              top: `${top + height <= 76 ? top : 76}px`,
                              left: left - 35,
                              ...styles
                           }}
                        >
                           {!autocomplete.loading ? (
                              <Paper p={4} radius="xs">
                                 <Text size="sm">No se encontraron resultados.</Text>
                              </Paper>
                           ) : autocomplete.query.length < 4 && autocomplete.type === 'item' ? (
                              <Paper p={4} radius="xs">
                                 <Text size="sm">Por favor ingresa al menos 3 letras.</Text>
                              </Paper>
                           ) : (
                              <Paper p={4} radius="xs">
                                 <Center>
                                    <Loader size="xs" />
                                 </Center>
                              </Paper>
                           )}
                        </Combobox.Options>
                     )}
                  </Transition>
               </Group>
            </Combobox>
            {errors.answer ? (
               <Text color="red" size="sm" mt="sm">
                  {errors.answer.message}
               </Text>
            ) : (
               ''
            )}
         </Box>
      </>
   )
}


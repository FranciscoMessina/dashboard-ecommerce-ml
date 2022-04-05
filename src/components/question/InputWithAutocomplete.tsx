import { Combobox } from '@headlessui/react'
import { Group, Paper, ScrollArea, Box, Image, createStyles, Text, Checkbox } from '@mantine/core'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Checks } from 'tabler-icons-react'
import { QuickAnswer, FullMeliItem } from '../../types/types'
import { useSetState, useDebouncedValue, upperFirst } from '@mantine/hooks'
import { getActiveToken, getTimeAgo } from '../../helpers'
import { useSearchMLItemQuery } from '../../hooks/useSearchMLItemsQuery'
import { useSearchQuickAnswersQuery } from '../../hooks/useSearchQuickAnswersQuery'
import getCaretCoordinates from 'textarea-caret'
import { UseMutateFunction, useQueryClient } from 'react-query'
import { useAnswerQuestion } from '../../hooks/useAnswerQuestion'
import { useUserConfigQuery } from '../../hooks/useUserConfigQuery'

const useStyles = createStyles((theme, _params, getRef) => ({
  comboboxInput: {
    display: 'block',
    width: '100%',
    height: '90px',
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
      borderWidth: '2px',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0]
    },

    '&::placeholder': { fontStyle: 'italic' }
  },
  comboboxButton: {
    position: 'absolute',
    right: 0,
    backgroundColor: theme.colors.blue[6],
    border: 0,
    height: '100%',
    paddingInline: '10px',
    cursor: 'pointer'
  },
  // className='scrollbar-hide absolute z-10 max-h-32 w-max overflow-y-auto px-2 text-sm'

  comboboxOptions: {
    position: 'absolute',
    zIndex: 10,
    maxHeight: 60,
    paddingBlock: 2
  },
  // className={`flex min-w-[150px] cursor-pointer items-center justify-start space-x-2 rounded-sm px-1 py-1 text-left shadow-md transition-all duration-100 ease-in-out ${
  // 	active ? 'bg-purple-600' : 'bg-white'
  // }`}
  comboboxOption: {
    display: 'flex',
    minWidth: 150,
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'start'
  }
}))

interface InputWithAutocompleteProps {
  answerQuestion: UseMutateFunction
  questionId: number
  dateCreated: Date
}

const InputWithAutocomplete: React.FC<InputWithAutocompleteProps> = ({
  answerQuestion,
  questionId,
  dateCreated
}) => {
  const { classes, theme } = useStyles()

  const queryClient = useQueryClient()
  // console.log(question)
  // Queries and mutations

  const userConfig = useUserConfigQuery()

  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [hello, setHello] = useState(true)
  const [goodbye, setGoodbye] = useState(true)

  // Answer a question
  const handleAnswer = async () => {
    if (answer && /\S/.test(answer)) {
      let finalAnswer = answer

      if (hello && userConfig?.data?.data.preAnswerMsg) {
        finalAnswer = `${userConfig?.data.data.preAnswerMsg} ${answer}`
      }

      if (goodbye && userConfig?.data?.data.postAnswerMsg) {
        finalAnswer = `${finalAnswer} ${userConfig?.data.data.postAnswerMsg}`
      }

      // console.log(finalAnswer);
      answerQuestion({
        id: questionId,
        answer: finalAnswer
      } as unknown as void)

      if (true) {
        return queryClient.invalidateQueries('questions')
      } else {
        setError('Ups ocurrio algo inesperado, espera un rato y si no funciona llama a Fran')
        setTimeout(() => setError(''), 8000)
        return
      }
    } else {
      setAnswer('')
      setError('No podes enviar una respuesta vacia!')
      setTimeout(() => setError(''), 8000)
      return
    }
  }

  // State and queries for Listings and Quick Answers autocomplete

  interface AutocompleteState {
    query: string
    results: any
  }
  const [autocomplete, setAutocomplete] = useSetState<AutocompleteState>({
    query: '',
    results: []
  })

  const [shouldOpen, setShouldOpen] = useState(false)

  const [query] = useDebouncedValue(autocomplete.query, 1000)

  const MlItemsQuery = useSearchMLItemQuery(query.slice(1), {
    enabled: false
  })

  const searchMlItems = MlItemsQuery.refetch

  const QuickAnswersQuery = useSearchQuickAnswersQuery(query.slice(1), {
    enabled: false
  })

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (shouldOpen) {
      e.preventDefault()
    }
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'Enter' && !shouldOpen) {
        // alert('I work_)')
        // handleAnswer()
      }
    }
  }

  const searchQuickAnswers = QuickAnswersQuery.refetch

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const position = textareaRef.current
    ? getCaretCoordinates(textareaRef.current, textareaRef.current.selectionEnd)
    : { top: 0, height: 0, left: 0 }

  const insertValue = (value: string) => {
    // setAnswer(answer.replace(/[@#][^@#\s]*$/, value + ' '))
    setAutocomplete({ query: '' })
    textareaRef!.current!.focus()
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, selectionEnd = 0 } = textareaRef.current!
    const result = getActiveToken(value, selectionEnd)

    if (!result?.word) return

    const { word } = result

    setShouldOpen(/^[@#]\w{0,30}$/.test(word))

    const split = word.split('_')

    const joined = split.join(' ')

    shouldOpen && setAutocomplete({ query: joined.toLowerCase() })

    if (!word) {
      setAutocomplete({ query: '' })
    }

    // console.log(e.currentTarget.value)

    // setAnswer(e.currentTarget.value !== '' ? e.currentTarget.value : '')
  }

  useEffect(() => {
    if (query.includes('@')) {
      searchQuickAnswers().then((res) => {
        setAutocomplete({ results: res?.data?.data.quickAnswers || [] })
      })
    }
    if (query.includes('#')) {
      searchMlItems().then((res) => {
        // console.log(res)
        setAutocomplete({ results: res?.data?.data.items || [] })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, searchMlItems, searchQuickAnswers])

  // End of autocomplete
  const drop = (e: React.DragEvent<HTMLTextAreaElement>) => {
    const value = e.dataTransfer.getData('value')

    setAnswer(`${answer}${value.trim()} `)
    textareaRef.current!.focus()
  }

  const dragOver = (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <>
      <Group align="end" position="apart" mb={0}>
        {userConfig?.data?.data.preAnswerMsg && (
          <Checkbox
            checked={hello}
            onChange={(e) => setHello(e.target.checked)}
            label={`${userConfig?.data?.data.preAnswerMsg}`}
            radius="xs"
            size="sm"
            mb="xs"
          />
        )}
        <Text
          size="xs"
          sx={{
            fontStyle: 'italic',
            marginLeft: 'auto'
          }}
        >
          {upperFirst(getTimeAgo(new Date(dateCreated).getTime()))}
        </Text>
      </Group>
      <Group sx={{ position: 'relative', width: '100%' }} noWrap mb={12}>
        <Combobox
          as="div"
          style={{ width: '100%' }}
          // @ts-ignore
          onChange={(value: QuickAnswer | FullMeliItem) => {
            if ('permalink' in value) {
              insertValue(value.permalink)
            } else {
              insertValue(value.text)
            }
            setAutocomplete({ results: [] })
          }}
          value={answer}
        >
          <Combobox.Input
            as="textarea"
            className={classes.comboboxInput}
            style={{
              borderColor: error ? theme.colors.red[7] : ''
            }}
            id={`answer-textarea`}
            placeholder="Ingresa tu respuesta"
            maxLength={2000}
            onChange={handleInput}
            ref={textareaRef}
            onKeyUp={handleKeyUp}
            onDrop={drop}
            onDragOver={dragOver}
          />
          {shouldOpen && autocomplete.results.length > 0 && (
            <Combobox.Options
              static
              className={classes.comboboxOptions}
              style={{
                top: position.top + position.height - 15,
                left: position.left - 30
              }}
            >
              <Paper
                component={ScrollArea}
                shadow="md"
                radius="xs"
                offsetScrollbars
                sx={(theme) => ({
                  height: 160
                })}
              >
                {autocomplete.results.map((value: QuickAnswer | FullMeliItem) => (
                  <Combobox.Option
                    key={'id' in value ? value.id : value._id}
                    value={value}
                    as="div"
                  >
                    {({ active }) => (
                      <Group
                        className={classes.comboboxOption}
                        spacing={12}
                        position="apart"
                        p={4}
                        sx={(theme) => ({
                          borderLeft: 4,
                          borderLeftStyle: 'solid',
                          borderColor: active ? theme.colors.blue[9] : 'transparent'
                        })}
                      >
                        {'secure_thumbnail' in value && (
                          <Box>
                            <Image
                              src={value.secure_thumbnail}
                              alt={value.title}
                              fit="contain"
                              sx={(theme) => ({
                                width: '1.5rem',
                                height: '1.5rem'
                              })}
                            />
                          </Box>
                        )}
                        <Text size="sm" transform={'name' in value ? 'uppercase' : 'none'}>
                          {'name' in value ? value.name : value.title}
                        </Text>
                        {'price' in value && <Text size="sm">${value.price}</Text>}
                      </Group>
                    )}
                  </Combobox.Option>
                ))}
              </Paper>
            </Combobox.Options>
          )}
          {/^[@#]\w{1,30}$/.test(query) && autocomplete.results.length === 0 && (
            <Combobox.Options
              static
              className={classes.comboboxOptions}
              style={{
                top: position.top + position.height - 15,
                left: position.left - 30
              }}
            >
              {MlItemsQuery.isLoading || QuickAnswersQuery.isLoading ? (
                <Paper p={4} radius="xs">
                  <Text size="sm">Cargando...</Text>
                </Paper>
              ) : (
                <Paper p={4} radius="xs">
                  <Text size="sm">No se encontraron resultados.</Text>
                </Paper>
              )}
            </Combobox.Options>
          )}
        </Combobox>

        <button
          className={classes.comboboxButton}
          onClick={handleAnswer}
          style={{
            backgroundColor: error ? theme.colors.red[7] : ''
          }}
        >
          <Checks color="white" size={32} />
        </button>
      </Group>

      {error ? (
        <Text size="xs" sx={{ fontStyle: 'italic' }} color="red" mt={0} mb="md">
          {error}
        </Text>
      ) : (
        <Text
          sx={(theme) => ({
            fontStyle: 'italic',
            color: theme.colors.gray[6]
          })}
          size="xs"
          mt={0}
          mb="md"
        >
          Tipeá &apos;@&apos; para respuestas rápidas o &apos;#&apos; para insertar un link a otra
          publicación. Usá Ctrl + Enter para enviar la respuesta.
        </Text>
      )}
      {userConfig?.data?.data.postAnswerMsg ? (
        <Checkbox
          checked={goodbye}
          onChange={(e) => setGoodbye(e.target.checked)}
          radius="xs"
          size="sm"
          my="md"
          label={`${userConfig?.data?.data.postAnswerMsg}`}
        />
      ) : (
        <Text size="xs" sx={{ fontStyle: 'italic' }}>
          Podes configurar tu saludo y despedida desde opciones.
        </Text>
      )}
    </>
  )
}

export default InputWithAutocomplete

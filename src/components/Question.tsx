import { Combobox } from '@headlessui/react'
import {
  Anchor,
  Checkbox,
  Divider,
  Group,
  Image,
  Loader,
  MediaQuery,
  Paper,
  Text,
  Box,
  Space,
  createStyles,
  ScrollArea,
  Center,
  Container
} from '@mantine/core'
import { upperFirst, useDebouncedValue, useSetState } from '@mantine/hooks'
import React, { ChangeEvent, DragEvent, useEffect, useRef, useState } from 'react'
import { QueryClient, useQueryClient } from 'react-query'
import { Checks, Message } from 'tabler-icons-react'
import getCaretCoordinates from 'textarea-caret'
import { getActiveToken, getTimeAgo } from '../helpers'
import { useAnswerQuestion } from '../hooks/useAnswerQuestion'
import { useSearchMLItemQuery } from '../hooks/useSearchMLItemsQuery'
import { useSearchQuickAnswersQuery } from '../hooks/useSearchQuickAnswersQuery'
import { useUserConfigQuery } from '../hooks/useUserConfigQuery'

import { FullMeliItem, MeliQuestionData, QuickAnswer } from '../types/types'
import PreviousQuestions from './PreviousQuestions'
import { QuestionOptionsDropdown } from './QuestionOptionsDropdown'

interface QuestionProps {
  question: MeliQuestionData
}

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

export const Question: React.FC<QuestionProps> = ({ question, ...rest }) => {
  const { classes, theme } = useStyles()
  const queryClient = useQueryClient()
  // console.log(question)
  // Queries and mutations
  const answerQuestionMutation = useAnswerQuestion({})

  const userConfig = useUserConfigQuery()

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

  const searchQuickAnswers = QuickAnswersQuery.refetch

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const position = textareaRef.current
    ? getCaretCoordinates(textareaRef.current, textareaRef.current.selectionEnd)
    : { top: 0, height: 0, left: 0 }

  const insertValue = (value: string) => {
    setAnswer(answer.replace(/[@#][^@#\s]*$/, value + ' '))
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

    setAnswer(e.currentTarget.value !== '' ? e.currentTarget.value : '')
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
      answerQuestionMutation.mutate({
        id: question.id,
        answer: finalAnswer
      } as unknown as void)

      if (answerQuestionMutation.isSuccess) {
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

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (shouldOpen) {
      e.preventDefault()
    }
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'Enter' && !shouldOpen) {
        // alert('I work_)')
        handleAnswer()
      }
    }
  }

  const drop = (e: DragEvent<HTMLTextAreaElement>) => {
    const value = e.dataTransfer.getData('value')

    setAnswer(`${answer}${value.trim()} `)
    textareaRef.current!.focus()
  }

  const dragOver = (e: DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  // If the question is answered dont render anything
  if (answerQuestionMutation.isSuccess) {
    return null
  }

  return (
    <Container
      size='xl'
      sx={(theme) => ({
        [theme.fn.largerThan('xl')]: {
          minWidth: '1000px'
        }
      })}
      px={0}
    >
      <Paper p="md" radius="sm" shadow="md" >
        <MediaQuery largerThan={'md'} styles={{ display: 'none' }}>
          <Anchor href={question.item.permalink} target="_blank" rel="noreferrer" mb="xl">
            {question.item.title}
          </Anchor>
        </MediaQuery>

        <Group
          noWrap
          align={'center'}
          sx={(theme) => ({
            [theme.fn.smallerThan('md')]: {
              marginTop: '15px'
            }
          })}
        >
          <Box
            sx={(theme) => ({
              position: 'relative'
            })}
          >
            <Image
              src={question.item.thumbnail}
              alt={question.item.title}
              fit="contain"
              height={90}
              width={90}
              withPlaceholder
              sx={(theme) => ({
                border: theme.colorScheme === 'light' ? '1px solid #ebebeb' : 'none'
              })}
              radius="xs"
            />
            <Box
              sx={(theme) => ({
                position: 'absolute',
                top: 0,
                left: 0,
                backgroundColor:
                  question.item.condition.value_id === '2230284'
                    ? theme.colors.yellow[7]
                    : theme.colors.blue[5],
                paddingInline: '3px',
                paddingBlock: 0,
                borderRadius: '0 0 5px  0'
              })}
            >
              <Text size="xs" weight={600} color="#fff" transform="uppercase">
                {question.item.condition.value_id === '2230284' ? 'nuevo' : 'usado'}
              </Text>
            </Box>
          </Box>

          {/* Product information */}
          <Group spacing={8} ml={7} position="apart" align={'start'} sx={{ width: '100%' }}>
            <Group direction="column" spacing={8}>
              <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
                <Anchor href={question.item.permalink} target="_blank" rel="noreferrer">
                  {question.item.title}
                </Anchor>
              </MediaQuery>
              <Group spacing={4}>
                <Text inline color={'indigo'} weight={600}>
                  ${question.item.price}
                </Text>
                <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
                  <Text> x {question.item.available_quantity} unidades </Text>
                </MediaQuery>
                {question.item.shipping.free_shipping === true ? (
                  <Text
                    transform="uppercase"
                    color={'green'}
                    weight={600}
                    sx={{ fontStyle: 'italic' }}
                  >
                    envio gratis
                  </Text>
                ) : null}
              </Group>
              <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
                <Group spacing={4}>
                  <Text inline>{question.from.nickname}</Text>
                  <span>-</span>
                  <Text inline m={0}>
                    {question.from.city}
                  </Text>
                </Group>
              </MediaQuery>
            </Group>
            {/* Question Actions */}
            <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
              <Group direction="column" position="left" align={'start'} sx={{ height: '100%' }}>
                <QuestionOptionsDropdown
                  questionId={question.id}
                  itemId={question.item_id}
                  {...question.item}
                />
              </Group>
            </MediaQuery>
          </Group>
        </Group>

        <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
          <Divider mb={10} mt={12} />
        </MediaQuery>
        {/* Question */}
        {!answerQuestionMutation.isLoading ? (
          <Group mt={10} spacing={4} noWrap align={'start'} position="left">
            <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
              <Message size={22} style={{}} />
            </MediaQuery>
            <Text
              size="sm"
              sx={(theme) => ({
                flex: '1 1 0%'
              })}
            >
              {question.text}
            </Text>
          </Group>
        ) : null}
        <Space my={16} />

        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
          <Box sx={{ width: '100%' }}>
            {!answerQuestionMutation.isLoading ? (
              <Box>
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
                    {upperFirst(getTimeAgo(new Date(question.date_created).getTime()))}
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
                                  <Text
                                    size="sm"
                                    transform={'name' in value ? 'uppercase' : 'none'}
                                  >
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

                {userConfig?.data?.data.postAnswerMsg ? (
                  <Checkbox
                    checked={goodbye}
                    onChange={(e) => setGoodbye(e.target.checked)}
                    radius="xs"
                    size="sm"
                    label={`${userConfig?.data?.data.postAnswerMsg}`}
                  />
                ) : (
                  <Text size="xs" sx={{ fontStyle: 'italic' }}>
                    Podes configurar tu saludo y despedida desde opciones.
                  </Text>
                )}

                {error ? (
                  <Text size="xs" sx={{ fontStyle: 'italic' }} color="red" mt="md">
                    {error}
                  </Text>
                ) : (
                  <Text
                    sx={(theme) => ({
                      fontStyle: 'italic',
                      color: theme.colors.gray[6]
                    })}
                    size="xs"
                    mt="md"
                  >
                    Tipeá &apos;@&apos; para respuestas rápidas o &apos;#&apos; para insertar un
                    link a otra publicación. Usá Ctrl + Enter para enviar la respuesta.
                  </Text>
                )}
                {question.previous.length > 0 && (
                  <PreviousQuestions questions={question.previous} buyer={question.from.nickname} />
                )}
              </Box>
            ) : (
              <Center>
                <Loader />
              </Center>
            )}
          </Box>
        </MediaQuery>
      </Paper>
    </Container>
  )
}

export default Question

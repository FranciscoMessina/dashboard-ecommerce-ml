import {
  AutocompleteApi,
  AutocompleteOptions,
  InternalAutocompleteSource,
  OnSelectParams
} from '@algolia/autocomplete-core'
import {
  Box,
  createStyles,
  Group,
  Loader,
  Paper,
  ScrollArea,
  Text,
  Image,
  Center
} from '@mantine/core'
import React, { useRef } from 'react'
import { Checks } from 'tabler-icons-react'
import { getActiveToken } from '../../helpers'
import { replaceAt } from '../../helpers/replaceAt'
import { useAutocomplete } from '../../hooks/useAutocomplete'
import { useAxiosInstance } from '../../hooks/useAxios'
import { AutocompleteItem } from '../../types/autocomplete'
import getCaretCoordinates from 'textarea-caret'
import { MeliItem, MeliItemData, QuickAnswer } from '../../types/types'
import { QuickAnswersSource } from './QuickAnswersSource'
import { MeliItemSource } from './MeliItemSource'
import { debounce } from 'lodash'

const useStyles = createStyles((theme, _params, getRef) => ({
  textarea: {
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
      borderWidth: '1px',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0]
    },

    '&::placeholder': { fontStyle: 'italic' }
  },
  button: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.blue[6],
    border: 0,
    height: '100%',
    paddingInline: '10px',
    cursor: 'pointer'
  },
  resultsBox: {
    position: 'absolute',
    zIndex: 10,
    paddingBlock: 2,
    minWidth: '100px'
  }
}))

function debouncePromise(fn: (args: any) => Promise<any>, time: number) {
  let timerId: any = undefined;

  return function debounced(...args: any) {
    if (timerId) {
      clearTimeout(timerId);
    }

    return new Promise((resolve) => {
      // @ts-ignore
      timerId = setTimeout(() => resolve(fn(...args)), time);
    });
  };
}

const TypeahedInput: React.FC<Partial<AutocompleteOptions<AutocompleteItem>>> = (props) => {
  const { classes, theme, cx } = useStyles()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const axios = useAxiosInstance()

  const debounced = debouncePromise((items: QuickAnswer[] | MeliItem[]) => Promise.resolve(items), 500)
  

  const { autocomplete, state } = useAutocomplete({
    ...props,
    id: 'typeahead-input',
    defaultActiveItemId: 0,
    getSources({ query }) {
      const cursorPosition = textareaRef.current?.selectionEnd || 0
      const activeToken = getActiveToken(query, cursorPosition)

      if (activeToken?.word) {
        if (/^[@]\w{0,30}$/.test(activeToken?.word)) {
          return debounced([
            {
              sourceId: 'quickanswers',
              onSelect({ item, setQuery }: OnSelectParams<QuickAnswer>) {
                const [index] = activeToken.range
                const replacement = `${item.text} `
                const newQuery = replaceAt(query, replacement, index, activeToken.word.length)

                setQuery(newQuery)

                if (textareaRef.current) {
                  textareaRef.current.selectionEnd = index + replacement.length
                }
              },
              async getItems() {
                const response = await axios.get(`user/quickanswers?q=${activeToken.word.slice(1)}`)

                return response.data.quickAnswers
              }
            }
          ])
        }

        if (/^[#]\w{3,30}$/.test(activeToken?.word)) {
          return debounced([
            {
              sourceId: 'items',
              onSelect({ item, setQuery }: OnSelectParams<MeliItem>) {
                const [index] = activeToken.range
                const replacement = `${item.permalink} ${item.price} `
                const newQuery = replaceAt(query, replacement, index, activeToken.word.length)
                console.log('Aca estoy')

                setQuery(newQuery)

                if (textareaRef.current) {
                  textareaRef.current.selectionEnd = index + replacement.length
                }
              },
              async getItems() {
                const response = await axios.get(`ml/items/search?q=${activeToken.word.slice(1)}`)

                return response.data.items
              }
            }
          ])
        }
      }

      return []
    }
  })

  function onInputNavigate() {
    const cursorPosition = textareaRef.current?.selectionEnd || 0
    const activeToken = getActiveToken(state.query, cursorPosition)
    const shouldOpen = /^[@#]\w{0,30}$/.test(activeToken?.word || '')

    autocomplete.setIsOpen(shouldOpen)
    autocomplete.refresh()
  }

  const { top, height, left } = textareaRef.current
    ? getCaretCoordinates(textareaRef.current, textareaRef.current?.selectionEnd)
    : { top: 0, height: 0, left: 0 }

  const inputProps = autocomplete.getInputProps({
    inputElement: textareaRef.current as unknown as HTMLInputElement,
    maxLength: 2000
  })

  return (
    <div {...autocomplete.getRootProps()} style={{ position: 'relative' }}>
      <Group noWrap mb={12}>
        <form
          style={{ width: '100%' }}
          {...autocomplete.getFormProps({
            inputElement: textareaRef.current as unknown as HTMLInputElement
          })}
        >
          <Box>
            <textarea
              {...inputProps}
              className={classes.textarea}
              onKeyUp={(event) => {
                if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
                  onInputNavigate()
                }
              }}
              onClick={(event) => {
                inputProps.onClick(event)

                onInputNavigate()
              }}
              ref={textareaRef}
            />
          </Box>

          <button className={classes.button}>
            <Checks color="white" size={32} />
          </button>
        </form>
      </Group>
      <div
        {...autocomplete.getPanelProps({})}
        style={{ top: `${top + height}px`, left: left, position: 'absolute' }}
      >
        {state.status === 'stalled' && !state.isOpen && (
          <Paper className={classes.resultsBox} shadow="md" radius="xs">
            <Center>
              <Loader variant="bars" size="xs" />
            </Center>
          </Paper>
        )}
        {state.isOpen &&
          state.collections.map(({ source, items }) => {
            // console.log(items)
            if (source.sourceId === 'quickanswers') {
              return (
                <Paper
                  key={`source-${source.sourceId}`}
                  component={ScrollArea}
                  className={classes.resultsBox}
                  offsetScrollbars
                  shadow="md"
                  radius="xs"
                >
                  {items.length > 0 && (
                    <QuickAnswersSource
                      autocomplete={
                        autocomplete as unknown as AutocompleteApi<
                          QuickAnswer,
                          React.BaseSyntheticEvent<object, any, any>,
                          React.MouseEvent<Element, MouseEvent>,
                          React.KeyboardEvent<Element>
                        >
                      }
                      items={items as QuickAnswer[]}
                      source={source as unknown as InternalAutocompleteSource<QuickAnswer>}
                    />
                  )}
                </Paper>
              )
            }

            return (
              <Paper
                key={`source-${source.sourceId}`}
                component={ScrollArea}
                className={classes.resultsBox}
                offsetScrollbars
                shadow="md"
                radius="xs"
              >
                {items.length > 0 && (
                  <MeliItemSource
                    autocomplete={
                      autocomplete as unknown as AutocompleteApi<
                        MeliItem,
                        React.BaseSyntheticEvent<object, any, any>,
                        React.MouseEvent<Element, MouseEvent>,
                        React.KeyboardEvent<Element>
                      >
                    }
                    items={items as unknown as MeliItem[]}
                    source={source as unknown as InternalAutocompleteSource<MeliItem>}
                  />
                )}
              </Paper>
            )
          })}
      </div>
    </div>
  )
}

export default TypeahedInput

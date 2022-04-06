import { AutocompleteOptions } from '@algolia/autocomplete-core'
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
import { MeliItem, MeliItemData } from '../../types/types'

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
  },
  resultsList: {
    listStyle: 'none',
    padding: 5,
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

const TypeahedInput: React.FC<Partial<AutocompleteOptions<AutocompleteItem>>> = (props) => {
  const { classes, theme, cx } = useStyles()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const axios = useAxiosInstance()

  const { autocomplete, state } = useAutocomplete({
    ...props,
    id: 'typeahead-input',
    defaultActiveItemId: 0,
    getSources({ query }) {
      const cursorPosition = textareaRef.current?.selectionEnd || 0
      const activeToken = getActiveToken(query, cursorPosition)

      if (activeToken?.word) {
        if (/^[@]\w{0,30}$/.test(activeToken?.word)) {
          return [
            {
              sourceId: 'quickanswers',
              onSelect({ item, setQuery }) {
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
          ]
        }

        if (/^[#]\w{3,30}$/.test(activeToken?.word)) {
          return [
            {
              sourceId: 'items',
              onSelect({ item, setQuery }) {
                const [index] = activeToken.range
                const replacement = `${item.permalink} `
                const newQuery = replaceAt(query, replacement, index, activeToken.word.length)

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
          ]
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
                    <ul {...autocomplete.getListProps()} className={classes.resultsList}>
                      {items.map((item) => {
                        const itemProps = autocomplete.getItemProps({
                          item,
                          source
                        })

                        return (
                          <li
                            key={item._id}
                            {...itemProps}
                            className={cx(classes.result, {
                              [classes.active]: itemProps['aria-selected']
                            })}
                          >
                            <Box
                              p={5}
                              sx={(theme) => ({
                                borderLeft: 4,
                                borderLeftStyle: 'solid',
                                borderColor: itemProps['aria-selected']
                                  ? theme.colors.yellow[9]
                                  : 'transparent'
                              })}
                            >
                              {item.name}
                            </Box>
                          </li>
                        )
                      })}
                    </ul>
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
                  <ul {...autocomplete.getListProps()} className={classes.resultsList}>
                    {items.map((item) => {
                      const itemProps = autocomplete.getItemProps({
                        item,
                        source
                      })

                      return (
                        <li
                          key={item.id}
                          {...itemProps}
                          className={cx(classes.result, {
                            [classes.active]: itemProps['aria-selected']
                          })}
                        >
                          <MeliItemResult item={item} active={itemProps['aria-selected']} />
                        </li>
                      )
                    })}
                  </ul>
                )}
              </Paper>
            )
          })}
      </div>
    </div>
  )
}

export default TypeahedInput

interface MeliItemResultProps {
  item: MeliItem
  active: boolean
}

function MeliItemResult({ item, active }: MeliItemResultProps) {
  const { classes } = useStyles()
  return (
    <Group
      className={classes.result}
      spacing={12}
      position="apart"
      p={4}
      sx={(theme) => ({
        borderLeft: 4,
        borderLeftStyle: 'solid',
        borderColor: active ? theme.colors.yellow[9] : 'transparent'
      })}
    >
      <Image
        src={item.secure_thumbnail}
        alt={item.title}
        fit="contain"
        sx={(theme) => ({
          width: '1.5rem',
          height: '1.5rem'
        })}
      />

      <Text size="sm">{item.title}</Text>
      <Text size="sm">${item.price}</Text>
    </Group>
  )
}

import { Combobox } from '@headlessui/react'
import { Box, createStyles, Group, Image, Text } from '@mantine/core'
import React from 'react'
import { MeliItem, QuickAnswer } from '../../types/types.js'

const useStyles = createStyles((theme, _params, getRef) => ({
  resultsBox: {
    position: 'absolute',
    zIndex: 10,
    paddingBlock: 0,
    minWidth: '100px'
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

interface AutocompleteMeliItemProps {
  item: MeliItem
}

export const AutocompleteMeliItem: React.FC<AutocompleteMeliItemProps> = ({ item }) => {
  const { classes, cx, theme } = useStyles()
  return (
    <Combobox.Option value={item.permalink}>
      {({ active }) => (
        <Group
        noWrap
          p={4}
          className={cx(classes.result, {
            [classes.active]: active
          })}
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
              width: '2.5rem',
              height: '2.5rem'
            })}
          />

          <Group direction="column" spacing={2}>
            <Text size="sm">{item.title}</Text>
            <Text size="sm">${item.price}</Text>
          </Group>
        </Group>
      )}
    </Combobox.Option>
  )
}

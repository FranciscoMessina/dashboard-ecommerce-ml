import { Combobox } from '@headlessui/react'
import { Box, createStyles } from '@mantine/core'
import React from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { QuickAnswer } from '../../types/types.js'

const useStyles = createStyles((theme, _params, getRef) => ({
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

interface AutocompleteLinkOptionProps {
  value: string
}

export const AutocompleteLinkOption: React.FC<AutocompleteLinkOptionProps> = ({ value }) => {
  const { auth } = useAuth()

  const url = `https://listado.mercadolibre.com.ar/${value.split(' ').join('-')}_CustId_${
    auth.meliId
  }`

  const { classes, cx, theme } = useStyles()
  return (
    <Combobox.Option value={url} as="li">
      {({ active }) => (
        <div
          className={cx(classes.result, {
            [classes.active]: active
          })}
        >
          <Box
            p={5}
            sx={(theme) => ({
              borderLeft: 4,
              borderLeftStyle: 'solid',
              borderColor: active ? theme.colors.yellow[9] : 'transparent'
            })}
          >
            Insertar link a busqueda: {value}
          </Box>
        </div>
      )}
    </Combobox.Option>
  )
}

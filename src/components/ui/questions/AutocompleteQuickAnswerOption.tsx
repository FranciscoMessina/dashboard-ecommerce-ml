import { Combobox } from '@headlessui/react'
import { Box, createStyles } from '@mantine/core'
import React from 'react'
import { QuickAnswer } from '../../../types/types.js'

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

interface AutocompleteQuickAnswerOptionProps {
   value: QuickAnswer
}

export const AutocompleteQuickAnswerOption: React.FC<AutocompleteQuickAnswerOptionProps> = ({
   value
}) => {
   const { classes, cx, theme } = useStyles()
   return (
      <Combobox.Option value={value.text} as="li">
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
                     borderColor: active ? theme.colors.yellow[9] : 'transparent',
                     textTransform: 'uppercase'
                  })}
               >
                  {value.name}
               </Box>
            </div>
         )}
      </Combobox.Option>
   )
}

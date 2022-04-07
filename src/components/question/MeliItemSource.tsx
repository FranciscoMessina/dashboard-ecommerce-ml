import { createStyles, Group, Image, Text } from '@mantine/core'
import { SourceProps } from '../../types/autocomplete'
import { MeliItem, MeliItemData } from '../../types/types'

const useStyles = createStyles((theme, _params, getRef) => ({
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



export function MeliItemSource({ source, items, autocomplete }: SourceProps<MeliItem>) {
  const { classes, cx } = useStyles()

  return (
    <ul {...autocomplete.getListProps()} className={classes.resultsList}>
      {items.map((item) => {
        const itemProps = autocomplete.getItemProps({
          item,
          source
        })

        return (
          <Group
            key={item.id}
            {...itemProps}
            className={cx(classes.result, {
              [classes.active]: itemProps['aria-selected']
            })}
            spacing={12}
            position="apart"
            p={4}
            sx={(theme) => ({
              borderLeft: 4,
              borderLeftStyle: 'solid',
              borderColor: itemProps['aria-selected'] ? theme.colors.yellow[9] : 'transparent'
            })} >
              {item.title}
            </Group>
          // <Group
          //   key={item.id}
          //   {...itemProps}
          //   className={cx(classes.result, {
          //     [classes.active]: itemProps['aria-selected']
          //   })}
          //   spacing={12}
          //   position="apart"
          //   p={4}
          //   sx={(theme) => ({
          //     borderLeft: 4,
          //     borderLeftStyle: 'solid',
          //     borderColor: itemProps['aria-selected'] ? theme.colors.yellow[9] : 'transparent'
          //   })}
          // >
          //   <Image
          //     src={item.secure_thumbnail}
          //     alt={item.title}
          //     fit="contain"
          //     sx={(theme) => ({
          //       width: '1.5rem',
          //       height: '1.5rem'
          //     })}
          //   />

          //   <Text size="sm">{item.title}</Text>
          //   <Text size="sm">${item.price}</Text>
          // </Group>
        )
      })}
    </ul>
  )
}

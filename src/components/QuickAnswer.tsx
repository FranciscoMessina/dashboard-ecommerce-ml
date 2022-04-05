import { Box, Center, Paper, Text } from '@mantine/core'
import { DragEventHandler } from 'react'

interface QuickAnswerProps {
  text: string
  name: string
  _id: string
  color: string
  draggable?: boolean
}

function QuickAnswer({ text, name, _id, color, draggable }: QuickAnswerProps) {
  const dragStart: DragEventHandler<HTMLDivElement> = (e) => {
    const target = e.target

    if (target instanceof HTMLDivElement && target.dataset.value) {
      e.dataTransfer.setData('value', target.dataset.value)
    }
  }

  const dragOver: DragEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
  }

  return (
    <Paper
      draggable={draggable ? 'true' : 'false'}
      onDragStart={dragStart}
      onDragOver={dragOver}
      px={4}
      style={{
        backgroundColor: color,
        width: '95%',
        textTransform: 'uppercase',
        cursor: draggable ? 'pointer' : 'default',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      data-value={text}
      data-id={_id}
      my={2}
    >
      <Center>
        <Text weight={600} color="white">
          {name}
        </Text>
      </Center>
    </Paper>
  )
}

export default QuickAnswer

import { Box, Center, Paper, Text } from '@mantine/core'
import { DragEventHandler } from 'react'

interface QuickAnswerProps {
  text: string
  name: string
  id: string
  color: string
  draggable?: boolean
  width?: number | string
  height?: number | string
}

function QuickAnswer({ text, name, id, color, draggable, width, height }: QuickAnswerProps) {
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
        width: width ? `${width}` : `220px`,
        height: height ? `${height}` : '28px',
        textTransform: 'uppercase',
        cursor: draggable ? 'pointer' : 'default'
      }}
      data-value={text}
      data-id={id}
      my={6}
    >
      <Center>
        <Text
          weight={600}
          color="white"
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {name}
        </Text>
      </Center>
    </Paper>
  )
}

export default QuickAnswer

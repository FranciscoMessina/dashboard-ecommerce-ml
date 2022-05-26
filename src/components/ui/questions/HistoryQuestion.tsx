import { Anchor, Box, Divider, Group, Image, MediaQuery, Paper, Text } from '@mantine/core'
import React from 'react'
import { Message, Message2 } from 'tabler-icons-react'
import { MeliQuestionData } from '../../../types/types.js'

interface HistoryQuestionProps {
  question: MeliQuestionData
}

export const HistoryQuestion: React.FC<HistoryQuestionProps> = ({ question }) => {
  console.log(question)

  return (
    <Paper
      p="md"
      radius="sm"
      shadow="md"
      withBorder
      sx={(theme) => ({
        width: '100%'
      })}
    >
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
            src={question.item.secure_thumbnail}
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
              </Group>
            </MediaQuery>
          </Group>
        </Group>
      </Group>

      <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
        <Divider mb={10} mt={12} />
      </MediaQuery>

      <Group align={'start'} noWrap>
        <Message size={24} style={{ alignSelf: 'flex-start' }} />
        <Text
          sx={(theme) => ({
            flex: ' 1 1 0%',
            wordBreak: 'break-all'
          })}
        >
          {question.text}
        </Text>
      </Group>
      <Text
        size="xs"
        sx={(theme) => ({
          fontStyle: 'italic',
          display: 'flex',
          justifyContent: 'flex-end'
        })}
      >
        {new Date(question.date_created).toLocaleDateString('es-ar', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>
      <Group align="start">
        <Message2 />
        <Text
          sx={(theme) => ({
            flex: ' 1 1 0%',
            wordBreak: 'break-word'
          })}
        >
          {question.answer.text}
        </Text>
      </Group>
      <Text
        size="xs"
        sx={(theme) => ({
          fontStyle: 'italic',
          display: 'flex',
          justifyContent: 'flex-end'
        })}
      >
        {new Date(question.answer.date_created).toLocaleDateString('es-ar', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </Text>
    </Paper>
  )
}

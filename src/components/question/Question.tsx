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
import { getActiveToken, getTimeAgo } from '../../helpers'
import { useAnswerQuestion } from '../../hooks/useAnswerQuestion'
import { useSearchMLItemQuery } from '../../hooks/useSearchMLItemsQuery'
import { useSearchQuickAnswersQuery } from '../../hooks/useSearchQuickAnswersQuery'
import { useUserConfigQuery } from '../../hooks/useUserConfigQuery'

import { FullMeliItem, MeliQuestionData, QuickAnswer } from '../../types/types'
import InputWithAutocomplete from './InputWithAutocomplete'
import PreviousQuestions from './PreviousQuestions'
import { QuestionOptionsDropdown } from './QuestionOptionsDropdown'
import TypeahedInput from './TypeaheadInput'

interface QuestionProps {
  question: MeliQuestionData
}

export const Question: React.FC<QuestionProps> = ({ question, ...rest }) => {

  const answerQuestionMutation = useAnswerQuestion({})

  return (
    <Container
      size="xl"
      sx={(theme) => ({
        [theme.fn.largerThan('xl')]: {
          minWidth: '1000px'
        }
      })}
      px={0}
    >
      <Paper p="md" radius="sm" shadow="md">
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
                {/* <InputWithAutocomplete answerQuestion={answerQuestionMutation.mutate} dateCreated={question.date_created} questionId={question.id} /> */}
                <TypeahedInput answerQuestion={answerQuestionMutation.mutate} dateCreated={question.date_created} questionId={question.id}/>

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

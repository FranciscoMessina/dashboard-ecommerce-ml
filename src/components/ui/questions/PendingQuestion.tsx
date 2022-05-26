import {
   Anchor,
   Box,
   Checkbox,
   Divider,
   Group,
   Image,
   MediaQuery,
   Paper,
   Space,
   Text,
   Transition
} from '@mantine/core'
import { upperFirst } from '@mantine/hooks'
import { AxiosError } from 'axios'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Message } from 'tabler-icons-react'
import { PreviousQuestions, QuestionOptionsDropdown, TypeaheadInput } from '.'
import { getTimeAgo } from '../../../helpers'
import { useAxiosInstance, useUserConfigQuery } from '../../../hooks'
import { MeliQuestionData } from '../../../types/types'

interface QuestionProps {
   question: MeliQuestionData
}

export const PendingQuestion: React.FC<QuestionProps> = ({ question, ...rest }) => {
   const userConfig = useUserConfigQuery({
      onSuccess: (data) => {
         methods.setValue('hello', !!data.data.hello)
         methods.setValue('signature', !!data.data.signature)
      }

   })
   const axios = useAxiosInstance()

   const methods = useForm({
      defaultValues: {
         hello: userConfig.data?.data.hello ? true : false,
         answer: '',
         signature: userConfig.data?.data.signature ? true : false,
         questionId: question.id
      }
   })

   const {
      formState: { errors, isSubmitting, isSubmitSuccessful }
   } = methods

   const onSubmit = async (data: any) => {
      console.log(data)
      // await sleep(2000)

      const finalAnswer = `${data.hello ? `${userConfig.data?.data.hello} ` : ''}${data.answer}${data.signature ? ` ${userConfig.data?.data.signature}` : ''
         }`

      console.log({ finalAnswer })

      try {
         const response = await axios.post('meli/answers', {
            answer: finalAnswer,
            id: data.questionId
         })

         console.log(response)
      } catch (e) {
         const error = e as AxiosError

         methods.setError('answer', {
            message: error.response?.data?.message
         })

         console.log(error.response?.data)
      }
   }

   return (
      <Transition
         mounted={!isSubmitSuccessful}
         transition="slide-left"
         duration={500}
         exitDuration={500}
      >
         {(styles) => (
            <Paper
               p="md"
               radius="sm"
               shadow="md"
               withBorder
               sx={(theme) => ({
                  width: '100%',
                  ...styles
               })}
            >
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
                              <Divider
                                 orientation="vertical"
                                 mt={2}
                                 mx="xs"
                                 sx={{ height: '17px' }}
                                 color="gray"
                              />
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

               <Group mt={10} spacing={4} noWrap align={'start'} position="left">
                  <MediaQuery smallerThan={'md'} styles={{ display: 'none' }}>
                     <Message size={22} style={{}} />
                  </MediaQuery>
                  <Text
                     size="sm"
                     sx={(theme) => ({
                        flex: '1 1 0%',
                        wordBreak: 'break-word'
                     })}
                  >
                     {question.text}
                  </Text>
               </Group>

               <Space my={16} />
               <FormProvider {...methods}>
                  <form onSubmit={methods.handleSubmit(onSubmit)}>
                     <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                        <Box sx={{ width: '100%' }}>
                           <Box>
                              <Group align="end" position="apart" mb={0}>
                                 {userConfig?.data?.data.hello && (
                                    <Checkbox
                                       label={`${userConfig?.data?.data.hello}`}
                                       radius="xs"
                                       size="sm"
                                       mb="xs"
                                       {...methods.register('hello')}
                                       disabled={isSubmitting}
                                    />
                                 )}

                                 <Text
                                    size="xs"
                                    sx={{
                                       fontStyle: 'italic',
                                       marginLeft: 'auto'
                                    }}
                                 >
                                    {upperFirst(getTimeAgo(new Date(question.date_created).getTime()))}
                                 </Text>
                              </Group>

                              <TypeaheadInput />

                              <Text
                                 sx={(theme) => ({
                                    fontStyle: 'italic',
                                    color: theme.colors.gray[6]
                                 })}
                                 size="xs"
                                 mt={10}
                                 mb="sm"
                              >
                                 Tipeá &apos;@&apos; para respuestas rápidas o &apos;#&apos; para insertar un
                                 link a otra publicación. Usá Ctrl + Enter para enviar la respuesta.
                              </Text>

                              {userConfig?.data?.data.signature && (
                                 <Checkbox
                                    label={`${userConfig?.data?.data.signature}`}
                                    radius="xs"
                                    size="sm"
                                    mb="md"
                                    {...methods.register('signature')}
                                    disabled={isSubmitting}
                                 />
                              )}

                              {question.previous.results.length > 0 && (
                                 <PreviousQuestions
                                    questions={question.previous}
                                    buyer={question.from}
                                    itemId={question.item_id}
                                 />
                              )}
                           </Box>
                        </Box>
                     </MediaQuery>
                  </form>
               </FormProvider>
            </Paper>
         )}
      </Transition>
   )
}



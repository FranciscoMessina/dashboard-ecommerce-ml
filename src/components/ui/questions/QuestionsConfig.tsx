import { Drawer, Title, Text, Divider, Space, Textarea, Button, Group } from '@mantine/core'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { useAxiosInstance, useUserConfigQuery } from '../../../hooks'


interface QuestionsConfigProps {
   open: boolean
   setOpen: (open: boolean) => void
}

export const QuestionsConfig: React.FC<QuestionsConfigProps> = ({ open, setOpen }) => {
   const userConfigResult = useUserConfigQuery({
      onSuccess: (data) => {
         helloForm.setValue('text', data.data.hello!)
         signatureForm.setValue('text', data.data.signature!)
      }
   })
   const queryClient = useQueryClient()
   const { data, isLoading } = userConfigResult

   const axios = useAxiosInstance()

   const helloForm = useForm({
      defaultValues: {
         text: data?.data?.hello || ''
      }
   })

   const signatureForm = useForm({
      defaultValues: {
         text: data?.data?.signature || ''
      }
   })

   const submitHello = async (values: { text: string }) => {
      try {
         const res = await axios.post('/users/hello', {
            hello: values.text
         })
      } catch (err) {
         console.log(err)
      } finally {
         await queryClient.invalidateQueries('user-config', {
            active: true
         })
      }
   }

   const submitSignature = async (values: { text: string }) => {
      try {
         const res = await axios.post('/users/signature', {
            signature: values.text
         })
      } catch (err) {
         console.log(err)
      } finally {
         await queryClient.invalidateQueries('user-config', {
            active: true
         })
      }
   }

   const deleteMessage = async (message: 'hello' | 'signature') => {
      try {
         const res = await axios.delete(`/users/${message}`)
      } catch (err) {
         console.log(err)
      } finally {
         await queryClient.invalidateQueries('user-config', {
            active: true
         })
      }
   }

   return (
      <Drawer
         position="right"
         opened={open}
         onClose={() => {
            helloForm.reset({
               text: data?.data.hello
            })
            signatureForm.reset({
               text: data?.data.signature
            })
            setOpen(false)
         }}
         padding="lg"
         size="lg"
      >
         <Title order={3}>Configuración</Title>
         <Divider my="xs" />
         <Text size="sm">Acá podés configurar tu saludo y despedida para las preguntas.</Text>

         <Space mt="xl" />
         <Title order={4}>Saludo:</Title>
         <Text size="xs">Este mensaje se agregara al inicio de tu respuesta al comprador.</Text>
         <Space my="xs" />
         <form onSubmit={helloForm.handleSubmit(submitHello)}>
            <Textarea
               minRows={4}
               {...helloForm.register('text', {
                  required: {
                     value: true,
                     message: 'No podes dejar el saludo vacío'
                  }
               })}
               error={helloForm.formState.errors.text?.message}
            />
            <Space my="xs" />
            <Group position="right">
               {data?.data.hello ? (
                  <>
                     <Button color="gray" onClick={() => deleteMessage('hello')}>
                        Eliminar
                     </Button>
                     <Button type="submit">Guardar</Button>
                  </>
               ) : (
                  <Button type="submit">Crear</Button>
               )}
            </Group>
         </form>

         <Space mt="xl" />
         <Title order={4}>Despedida:</Title>
         <Text size="xs">Este mensaje se agregara al final de tu respuesta al comprador.</Text>
         <Space my="xs" />
         <form onSubmit={signatureForm.handleSubmit(submitSignature)}>
            <Textarea
               minRows={4}
               {...signatureForm.register('text', {
                  required: {
                     value: true,
                     message: 'No podes dejar el saludo vacío'
                  }
               })}
               error={signatureForm.formState.errors.text?.message}
            />
            <Space my="xs" />
            <Group position="right">
               {data?.data.signature ? (
                  <>
                     <Button color="gray" onClick={() => deleteMessage('signature')}>
                        Eliminar
                     </Button>
                     <Button type="submit">Guardar</Button>
                  </>
               ) : (
                  <Button type="submit">Crear</Button>
               )}
            </Group>
         </form>
      </Drawer>
   )
}

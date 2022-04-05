// import { Menu, Transition } from '@headlessui/react'
import { ActionIcon, Menu, Text, useMantineTheme } from '@mantine/core'
import { useModals } from '@mantine/modals'
import { useNotifications } from '@mantine/notifications'
import { FC, useCallback } from 'react'
import { useQueryClient } from 'react-query'
import { Check, DotsVertical, PlayerPause, PlayerPlay, Trash, X } from 'tabler-icons-react'
import axios from '../helpers/axios'
import { useAuth } from '../hooks/useAuth'
import { useAxiosInstance } from '../hooks/useAxios'

interface QuestionOptionsDropdownProps {
  blockUser?: (id: number) => void
  questionId: number
  itemId: string
  status: string
}

export const QuestionOptionsDropdown: FC<QuestionOptionsDropdownProps> = ({
  blockUser,
  questionId,
  itemId,
  status
}) => {
  const queryClient = useQueryClient()
  const theme = useMantineTheme()
  const modals = useModals()
  const notifications = useNotifications()

  const axiosPrivate = useAxiosInstance()

  // Delete a question
  const deleteQuestion = useCallback(() => {
    const modalId = modals.openConfirmModal({
      centered: true,
      title: 'Eliminar Pregunta.',
      children: <Text size="sm">Estas seguro que queres eliminar esta pregunta?</Text>,
      labels: { confirm: 'Eliminar', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onCancel: () => {
        modals.closeModal(modalId)
      },
      onConfirm: async () => {
        // make api call to delete question
        const id = notifications.showNotification({
          loading: true,
          title: 'Eliminando Pregunta',
          message: '',
          autoClose: false,
          disallowClose: true
        })
        try {
          const response = await axiosPrivate.delete(`/ml/questions?id=${questionId}`)

          if (response.data.status === 'DELETED') {
            notifications.updateNotification(id, {
              id,
              color: 'teal',
              title: 'Pregunta Eliminada',
              message: '',
              autoClose: 2000,
              icon: <Check />
            })
          } else {
            notifications.updateNotification(id, {
              id,
              title: 'No se pudo eliminar la pregunta',
              message: 'Intenta de nuevo',
              autoClose: 2000,
              color: 'red',
              icon: <X />
            })
          }
        } catch (err) {
          notifications.updateNotification(id, {
            id,
            title: 'Algo salio mal',
            message: 'Intenta de nuevo',
            autoClose: 2000,
            color: 'red',
            icon: <X />
          })
        }
        await queryClient.invalidateQueries('questions')
      }
    })
  }, [questionId, modals, notifications, queryClient])

  // console.log(handleDelete)

  const pauseItem = useCallback(() => {
    const modalId = modals.openConfirmModal({
      centered: true,
      title: 'Pausar Publicacion.',
      children: <Text size="sm">Estas seguro que queres pausar esta publicacion?</Text>,
      labels: { confirm: 'Pausar', cancel: 'Cancelar' },
      confirmProps: { color: 'yellow' },
      onCancel: () => {
        modals.closeModal(modalId)
      },
      onConfirm: async () => {
        // make api call to delete question
        const id = notifications.showNotification({
          loading: true,
          title: 'Pausando Publicacion',
          message: '',
          autoClose: false,
          disallowClose: true
        })
        try {
          const response = await axiosPrivate.put(`/ml/items/${itemId}/pause`)

          if (response.data.data.status === 'paused') {
            notifications.updateNotification(id, {
              id,
              color: 'teal',
              title: 'Publicacion Pausada',
              message: '',
              autoClose: 2000,
              icon: <Check />
            })
            queryClient.invalidateQueries('questions')
          } else {
            notifications.updateNotification(id, {
              id,
              title: 'No se pudo pausar la publicacion',
              message: 'Intenta de nuevo',
              autoClose: 2000,
              color: 'red',
              icon: <X />
            })
          }
        } catch (err) {
          notifications.updateNotification(id, {
            id,
            title: 'Algo salio mal',
            message: 'Intenta de nuevo',
            autoClose: 2000,
            color: 'red',
            icon: <X />
          })
        }
        await queryClient.invalidateQueries('questions')
      }
    })
  }, [itemId, modals, notifications, queryClient])

  const activateItem = useCallback(() => {
    const modalId = modals.openConfirmModal({
      centered: true,
      title: 'Reactivar Publicacion.',
      children: <Text size="sm">Estas seguro que queres reactivar esta publicacion?</Text>,
      labels: { confirm: 'Reactivar', cancel: 'Cancelar' },
      confirmProps: { color: 'green' },
      onCancel: () => {
        modals.closeModal(modalId)
      },
      onConfirm: async () => {
        // make api call to delete question
        const id = notifications.showNotification({
          loading: true,
          title: 'Reactivando Publicacion',
          message: '',
          autoClose: false,
          disallowClose: true
        })
        try {
          const response = await axiosPrivate.put(`/ml/items/${itemId}/activate`)

          if (response.data.data.status === 'active') {
            notifications.updateNotification(id, {
              id,
              color: 'teal',
              title: 'Publicacion Reactivada',
              message: '',
              autoClose: 2000,
              icon: <Check />
            })
            queryClient.invalidateQueries('questions')
          } else {
            notifications.updateNotification(id, {
              id,
              title: 'No se pudo reactivar la publicacion',
              message: 'Intenta de nuevo',
              autoClose: 2000,
              color: 'red',
              icon: <X />
            })
          }
        } catch (err) {
          notifications.updateNotification(id, {
            id,
            title: 'Algo salio mal',
            message: 'Intenta de nuevo',
            autoClose: 2000,
            color: 'red',
            icon: <X />
          })
        }
        await queryClient.invalidateQueries('questions')
      }
    })
  }, [itemId, modals, notifications, queryClient])

  return (
    <Menu
      control={
        <ActionIcon>
          <DotsVertical size={22} />
        </ActionIcon>
      }
      transition="fade"
      placement="start"
      position="left"
      size="xs"
    >
      <Menu.Label>Acciones</Menu.Label>
      {status === 'paused' ? (
        <Menu.Item
          icon={<PlayerPlay size={16} color={theme.colors.green[6]} />}
          onClick={activateItem}
          sx={{
            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
            }
          }}
        >
          Reactivar
        </Menu.Item>
      ) : (
        <Menu.Item
          icon={<PlayerPause size={16} color={theme.colors.yellow[6]} />}
          onClick={pauseItem}
          sx={{
            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
            }
          }}
        >
          Pausar
        </Menu.Item>
      )}

      <Menu.Item
        icon={<Trash size={16} color={theme.colors.red[6]} />}
        onClick={deleteQuestion}
        sx={{
          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
          }
        }}
      >
        Eliminar
      </Menu.Item>
    </Menu>
  )
}
// return (
//   <div className="text-right">
//     <Menu as="div" className="relative inline-block text-left">
//       <div>
//         <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black bg-opacity-0 px-2 py-2 text-sm font-medium text-white transition-all duration-150 hover:bg-opacity-10">
//           <DotsVerticalIcon
//             className="h-6 w-6 text-black"
//             aria-hidden="true"
//           />
//         </Menu.Button>
//       </div>
//       <Transition
//         as={Fragment}
//         enter="transition ease-out duration-100"
//         enterFrom="transform opacity-0 scale-95"
//         enterTo="transform opacity-100 scale-100"
//         leave="transition ease-in duration-75"
//         leaveFrom="transform opacity-100 scale-100"
//         leaveTo="transform opacity-0 scale-95"
//       >
//         <Menu.Items className="absolute right-12 -top-3 z-50 mt-2 flex origin-top-right rounded-sm focus:outline-none">
//           <div className="flex px-1 py-1">
//             {status === 'active' ? (
//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active && 'bg-gray-100 '
//                     } group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm text-black `}
//                   >
//                     <PauseIcon
//                       className="h-6 w-6"
//                       aria-hidden="true"
//                       onClick={pauseItem}
//                     />
//                   </button>
//                 )}
//               </Menu.Item>
//             ) : (
//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active && 'bg-gray-100 '
//                     } group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm text-black`}
//                   >
//                     <PlayIcon
//                       className="h-6 w-6"
//                       aria-hidden="true"
//                       onClick={activateItem}
//                     />
//                   </button>
//                 )}
//               </Menu.Item>
//             )}
//             <Menu.Item>
//               {({ active }) => (
//                 <button
//                   className={`${
//                     active && 'bg-gray-100 '
//                   } group flex w-full items-center justify-center rounded-md px-2 py-2 text-sm text-black`}
//                 >
//                   <TrashIcon
//                     className="h-6 w-6"
//                     aria-hidden="true"
//                     onClick={() => handleDelete()}
//                   />
//                 </button>
//               )}
//             </Menu.Item>
//           </div>
//         </Menu.Items>
//       </Transition>
//     </Menu>
//   </div>
// )

import { useNotifications } from '@mantine/notifications'
import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { useRecoilValue } from 'recoil'
import { authAtom } from '../atoms/authAtom.js'

interface UpdatesHandlerProps {}

export const UpdatesHandler: React.FC<UpdatesHandlerProps> = ({}) => {
  const auth = useRecoilValue(authAtom)
  const queryClient = useQueryClient()
  const notifications = useNotifications()

  useEffect(() => {
    if (auth.userId) {
      const source = new EventSource(
        `${import.meta.env.VITE_API_URL}meli/updates?id=${auth.userId}`,
        {
          withCredentials: true
        }
      )

      source.onopen = () => {
        console.log('Connected to events')
      }

      source.onmessage = (ev) => {
        const notification = JSON.parse(ev.data)

        console.log(notification)

        notifications.showNotification({
          message: 'Algo paso en meli!',
          title: 'Nueva actualización',
          color: 'indigo',
          autoClose: 1000
        })

        // TODO: Test different accounts receiving events.

        if (notification.topic === 'questions') {
          setTimeout(
            () =>
              queryClient.refetchQueries(['questions'], {
                active: true
              }),
            500
          )
        }
      }
    }
  }, [auth])

  return null
}

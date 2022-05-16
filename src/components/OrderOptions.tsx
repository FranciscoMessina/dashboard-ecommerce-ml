// import { Menu, Transition } from '@headlessui/react'
import { ActionIcon, Divider, Menu, Text, useMantineTheme } from '@mantine/core'
import { useModals } from '@mantine/modals'
import { useNotifications } from '@mantine/notifications'
import { FC, useCallback } from 'react'
import { useQueryClient } from 'react-query'
import { Check, DotsVertical, PlayerPause, PlayerPlay, Trash, X } from 'tabler-icons-react'
import { useAxiosInstance } from '../hooks/useAxiosInstance'
import { Order, SearchStatus } from '../types/types.js'

interface OrderOptionsProps {
  order: Order
}

export const OrderOptions: FC<OrderOptionsProps> = ({ order }) => {
  const queryClient = useQueryClient()
  const theme = useMantineTheme()
  const modals = useModals()
  const notifications = useNotifications()
  const axios = useAxiosInstance()

  const updateOrderSearchStatus = async (searchStatus: SearchStatus) => {
    try {
      const res = await axios.patch(`/orders/${order.id}`, { searchStatus })

      console.log(res)
    } catch (err) {
      console.log(err)
    } finally {
      await queryClient.refetchQueries(['orders'], {
        active: true
      })
    }
  }

  let borderColor

  switch (order.searchStatus) {
    case SearchStatus.Pending:
      borderColor = theme.colors.yellow[5]
      break
    case SearchStatus.NotFound:
      borderColor = theme.colors.red[5]
      break
    case SearchStatus.Found:
      borderColor = theme.colors.blue[5]
      break
    default:
      borderColor = theme.colors.green[5]
      break
  }

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
      size="sm"
    >
      <Menu.Label>Acciones</Menu.Label>

      {order.searchStatus === SearchStatus.Pending && (
        <>
          <Menu.Item
            onClick={() => updateOrderSearchStatus(SearchStatus.Found)}
            sx={{
              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
              }
            }}
          >
            Encontrado
          </Menu.Item>
          <Menu.Item
            onClick={() => updateOrderSearchStatus(SearchStatus.NotFound)}
            sx={{
              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
              }
            }}
          >
            No encontrado
          </Menu.Item>
        </>
      )}

      {order.searchStatus === SearchStatus.Found && (
        <Menu.Item
          onClick={() => updateOrderSearchStatus(SearchStatus.Pending)}
          sx={{
            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
            }
          }}
        >
          Pendiente
        </Menu.Item>
      )}

      {order.searchStatus === SearchStatus.NotFound && (
        <>
          <Menu.Item
            onClick={() => updateOrderSearchStatus(SearchStatus.Found)}
            sx={{
              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
              }
            }}
          >
            Encontrado
          </Menu.Item>
          <Menu.Item
            onClick={() => updateOrderSearchStatus(SearchStatus.Pending)}
            sx={{
              '&:hover': {
                backgroundColor:
                  theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
              }
            }}
          >
            Pendiente
          </Menu.Item>
        </>
      )}

      {order.searchStatus === SearchStatus.Delivered && (
        <Menu.Item
          sx={{
            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
            }
          }}
        >
          No se que poner aca
        </Menu.Item>
      )}

      <Divider my="xs" />
      <Menu.Item
        component="a"
        href={`https://www.mercadolibre.com.ar/ventas/${order.meliOrderIds[0]}/detalle`}
        target="_blank"
        rel="noreferrer noopener"
        sx={{
          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
          }
        }}
      >
        Ver detalle
      </Menu.Item>
    </Menu>
  )
}

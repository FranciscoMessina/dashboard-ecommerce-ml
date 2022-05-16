import { Button } from '@mantine/core'
import React from 'react'
import { useQueryClient } from 'react-query'
import { useAxiosInstance } from '../hooks/useAxiosInstance.js'
import { Order, SearchStatus } from '../types/types'

interface SearchStatusButtonProps {
  order: Order
}

export const FoundStatusButton: React.FC<SearchStatusButtonProps> = ({ order }) => {
  const axios = useAxiosInstance()
  const queryClient = useQueryClient()

  const markOrderAsDelivered = async () => {
    try {
      const res = await axios.patch(`/orders/${order.id}`)

      console.log(res)
    } catch (err) {
      console.log(err)
    } finally {
      await queryClient.refetchQueries(['orders'], {
        active: true
      })
    }
  }

  const printShippingLabel = async () => {
    try {
      const res = await axios.patch(`/orders/${order.id}`)

      console.log(res)
    } catch (err) {
      console.log(err)
    } finally {
      await queryClient.refetchQueries(['orders'], {
        active: true
      })
    }
  }

  if (order.shippingId) {
    return <Button onClick={printShippingLabel}>Imprimir Etiqueta</Button>
  }

  return <Button size="xs">Entregar</Button>
}

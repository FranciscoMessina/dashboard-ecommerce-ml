import { Loader } from '@mantine/core'
import { AxiosError, AxiosResponse } from 'axios'
import React from 'react'
import { useQuery } from 'react-query'

import { useAxiosInstance } from '../hooks'

export const ItemsPage = () => {
   const axios = useAxiosInstance()
   const queryResult = useQuery<AxiosResponse, AxiosError>('items', () => axios.get('/meli/items'), {
      retry: false
   })

   console.log(queryResult.data?.data)

   if (queryResult.isLoading) {
      return <Loader />
   }

   if (queryResult.isError) {
      return <div>
         {JSON.stringify(queryResult.error, null, 2)}
         {JSON.stringify(queryResult.error?.response, null, 2)}
      </div>
   }


   return (
      <>
         <div>ItemsPage</div>
         <p>
            {JSON.stringify(queryResult.data?.data, null, 2)}

         </p>
      </>
   )
}

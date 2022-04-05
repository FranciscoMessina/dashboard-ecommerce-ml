import { useCallback } from 'react'
import { axiosPrivate } from '../helpers/axios'
import { useAuth } from './useAuth'

export const useRefreshToken = () => {
  const { auth, setAuth } = useAuth()

  const refresh = useCallback(async () => {
    const response = await axiosPrivate.get('auth/refresh')

    console.log('Refresh response', response)

    setAuth((prev) => {
      console.log(JSON.stringify(prev))
      console.log(response.data.accessToken)
      return {
        ...prev,
        roles: response.data.roles,
        user: response.data.id,
        accessToken: response.data.accessToken
      }
    })
    return response.data.accessToken
  }, [auth])

  return refresh
}

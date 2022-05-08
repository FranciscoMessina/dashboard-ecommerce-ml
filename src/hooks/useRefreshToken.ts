import { useCallback } from 'react'
import axios from '../helpers/axios'
import { useAuth } from './useAuth'

export const useRefreshToken = () => {
  const { auth, setAuth } = useAuth()

  const refresh = useCallback(async () => {
    const response = await axios.get('auth/refresh')

    setAuth((prev) => ({
      ...prev,
      roles: response.data.roles,
      user: response.data.id,
      accessToken: response.data.accessToken
    }))
    return response.data.accessToken
  }, [auth])

  return refresh
}

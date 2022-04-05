import { useEffect } from 'react'
import { axiosPrivate } from '../helpers'
import { useAuth } from './useAuth'
import { useRefreshToken } from './useRefreshToken'

export const useAxiosInstance = () => {
  const refresh = useRefreshToken()
  const { auth } = useAuth()

  useEffect(() => {
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config
        console.log(prevRequest)

        console.log(error.response)

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true

          const token = await refresh()

          prevRequest.headers['Authorization'] = `Bearer ${token.data.token}`

          return axiosPrivate(prevRequest)
        }

        return Promise.reject(error)
      }
    )

    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config?.headers!['authorization']) {
          config.headers!['Authorization'] = `Bearer ${auth?.accessToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    return () => {
      axiosPrivate.interceptors.response.eject(responseIntercept)
      axiosPrivate.interceptors.request.eject(requestIntercept)
    }
  }, [auth, refresh])

  return axiosPrivate
}

import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useRefreshToken } from '../../hooks/useRefreshToken'
import { Center, Loader } from '@mantine/core'

export const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth, setAuth } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    const verifyRefreshToken = async () => {
      try {
        await refresh()
      } catch (err) {
        console.error(err)
      } finally {
        isMounted && setIsLoading(false)
      }
    }

    !auth?.accessToken && auth.persist ? verifyRefreshToken() : setIsLoading(false)

    return () => {
      isMounted = false
    }
  }, [])

  // console.log(location)

  const authPaths = ['/auth/signin', '/auth/signup']

  if (authPaths.includes(location.pathname) && auth?.accessToken) {
    return <Navigate to="/" replace />
  }

  return (
    <>
      {!auth.persist ? (
        <Outlet />
      ) : isLoading ? (
        <Center
          sx={(theme) => ({
            width: '100vw',
            height: '100vh'
          })}
        >
          <Loader size="xl" />
        </Center>
      ) : (
        <Outlet />
      )}
    </>
  )
}

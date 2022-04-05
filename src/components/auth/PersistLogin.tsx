import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useRefreshToken } from '../../hooks/useRefreshToken'

export const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState(true)
  const refresh = useRefreshToken()
  const { auth, setAuth } = useAuth()

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

    // persist added here AFTER tutorial video
    // Avoids unwanted call to verifyRefreshToken
    !auth?.accessToken && auth.persist ? verifyRefreshToken() : setIsLoading(false)

    return () => {
      isMounted = false
    }
  }, [])

  // useEffect(() => {
  //   console.log(`isLoading: ${isLoading}`)
  //   console.log(`aT: ${JSON.stringify(auth?.accessToken)}`)
  // }, [isLoading])

  return <>{!auth.persist ? <Outlet /> : isLoading ? <p>Loading...</p> : <Outlet />}</>
}

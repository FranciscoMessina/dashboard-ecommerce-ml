import { useDebugValue } from 'react'
import { useRecoilState } from 'recoil'
import { authAtom } from '../atoms/authAtom'

export const useAuth = () => {
  const [auth, setAuth] = useRecoilState(authAtom)
  useDebugValue(auth, (auth) => (auth?.user ? 'Logged In' : 'Logged Out'))
  return { auth, setAuth }
}

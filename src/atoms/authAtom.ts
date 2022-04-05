import { atom } from 'recoil'

interface AuthState {
  user: string | null
  roles: string[]
  accessToken: string | null
  persist: boolean
}

export const authAtom = atom<AuthState>({
  key: 'auth',
  default: {
    user: null,
    roles: [],
    accessToken: null,
    persist: !!localStorage.getItem('persist') || false
  }
})

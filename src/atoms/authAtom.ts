import { atom } from 'recoil'

interface AuthState {
  userId: string | null
  roles: string[]
  accessToken: string | null
  persist: boolean
  meliId?: string | null
}

export const authAtom = atom<AuthState>({
  key: 'auth',
  default: {
    userId: null,
    roles: [],
    accessToken: null,
    persist: !!localStorage.getItem('persist') || false,
    meliId: null
  }
})

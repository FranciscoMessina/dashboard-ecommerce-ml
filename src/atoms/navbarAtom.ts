import { atom } from 'recoil'

export const navbarAtom = atom({
    key: 'navbarAtom',
    default: {
        open: true
    }
})
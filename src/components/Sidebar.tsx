import {
  createStyles,
  Group,
  Navbar,
  Overlay,
  Tooltip,
  Transition,
  UnstyledButton,
  useMantineTheme
} from '@mantine/core'
import { useClickOutside, useViewportSize } from '@mantine/hooks'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  Box,
  Home2,
  Icon as TablerIcon,
  Login,
  Logout,
  Plus,
  QuestionMark,
  Settings
} from 'tabler-icons-react'
import { authAtom } from '../atoms/authAtom'
import { navbarAtom } from '../atoms/navbarAtom'
import { useAuth } from '../hooks/useAuth'

const useStyles = createStyles((theme) => ({
  link: {
    width: 50,
    height: 50,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0]
    }
  },

  active: {
    '&, &:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.fn.rgba(theme.colors[theme.primaryColor][9], 0.25)
          : theme.colors[theme.primaryColor][0],
      color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 7]
    }
  }
}))

interface NavbarLinkProps {
  icon: TablerIcon
  label: string

  onClick?(): void
  route: string
}

function NavbarLink({ icon: Icon, label, onClick, route }: NavbarLinkProps) {
  const { classes, cx } = useStyles()
  return (
    <Tooltip
      label={label}
      position="right"
      withArrow
      transitionDuration={0}
      sx={{ position: 'relative' }}
    >
      <NavLink
        to={route}
        onClick={onClick}
        className={({ isActive }) => cx(classes.link, { [classes.active]: isActive })}
      >
        <Icon />
      </NavLink>
    </Tooltip>
  )
}

export function Sidebar() {
  const [open, setOpen] = useRecoilState(navbarAtom)


  const theme = useMantineTheme()
  const navLinks = [
    { icon: Home2, label: 'Inicio', route: '/' },
    {
      icon: QuestionMark,
      label: 'Preguntas',
      route: '/questions'
    },
    { icon: Box, label: 'Ventas', route: '/sales' },
    { icon: Plus, label: 'Publicar', route: '/publish' }
  ]

  const { width } = useViewportSize()

  const alwaysShow = width > theme.breakpoints.sm

  const { auth } = useAuth()

  const links = navLinks.map((link, index) => <NavbarLink {...link} key={link.label} />)

  return (
    <Transition
      mounted={!open.open || alwaysShow}
      transition="pop-top-left"
      duration={400}
      timingFunction="ease"
    >
      {(styles) => (
        <>
          <Navbar
            width={{ base: 60 }}
            hidden={open.open}
            hiddenBreakpoint="sm"
            style={styles}
          >
            <Navbar.Section grow mt={20}>
              <Group direction="column" align="center" spacing={2}>
                {links}
              </Group>
            </Navbar.Section>
            <Navbar.Section mb={10}>
              <Group direction="column" align="center" spacing={1}>
                <NavbarLink icon={Settings} label="Settings" route="/settings" />

                {auth.user ? (
                  <NavbarLink icon={Logout} label="Logout" route="/logout" />
                ) : (
                  <NavbarLink icon={Login} label="Login" route="/logout" />
                )}
              </Group>
            </Navbar.Section>
          </Navbar>
          {!alwaysShow && (
            <Overlay
              style={styles}
              zIndex={10}
              blur={1}
              color={theme.colorScheme === 'dark' ? '#000' : '#fff'}
              onClick={() => setOpen({ open: true })}
            />
          )}
        </>
      )}
    </Transition>
  )
}

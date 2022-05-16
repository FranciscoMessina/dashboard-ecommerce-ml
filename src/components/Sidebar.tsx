import {
  ActionIcon,
  createStyles,
  Group,
  GroupedTransition,
  Indicator,
  Navbar,
  Overlay,
  Tooltip,
  useMantineTheme
} from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { useRecoilState } from 'recoil'
import {
  Box,
  Home2,
  Icon as TablerIcon,
  Logout,
  Message2Code,
  Plus,
  QuestionMark,
  Settings
} from 'tabler-icons-react'
import { navbarAtom } from '../atoms/navbarAtom'
import { useAuth } from '../hooks/useAuth'
import { useAxiosInstance } from '../hooks/useAxiosInstance'
import { useGetQuestionsQuery } from '../hooks/useGetQuestionsQuery.js'

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
  indicator?: number
}

function NavbarLink({ icon: Icon, label, onClick, route, indicator }: NavbarLinkProps) {
  const { classes, cx } = useStyles()

  if (indicator) {
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
          <Indicator label={indicator} size={16} radius='sm' position='bottom-center'>
            <Icon />
          </Indicator>
        </NavLink>
      </Tooltip>
    )
  }

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

interface NavbarIconProps {
  icon: TablerIcon
  label: string
  onClick?(): void
}

function NavbarIcon({ icon: Icon, label, onClick }: NavbarIconProps) {
  const { classes, cx } = useStyles()
  return (
    <Tooltip
      label={label}
      position="right"
      withArrow
      transitionDuration={0}
      sx={{ position: 'relative' }}
    >
      <ActionIcon onClick={onClick} className={classes.link}>
        <Icon />
      </ActionIcon>
    </Tooltip>
  )
}

export function Sidebar() {
  const [open, setOpen] = useRecoilState(navbarAtom)
  const axios = useAxiosInstance()

  const { data: questions } = useGetQuestionsQuery()

  const theme = useMantineTheme()
  const navLinks = [
    { icon: Home2, label: 'Inicio', route: '/' },
    {
      icon: QuestionMark,
      label: 'Preguntas',
      route: '/questions',
      indicator: questions?.data?.total! > 0 ? questions?.data.total : undefined
    },
    { icon: Box, label: 'Ventas', route: '/orders' },
    { icon: Plus, label: 'Publicar', route: '/publish' },
    { icon: Message2Code, label: 'Mensaje Automatico', route: '/automessages' }
  ]

  const { width } = useViewportSize()

  const alwaysShow = width > theme.breakpoints.sm

  const { auth, setAuth } = useAuth()

  const links = navLinks.map((link, index) => <NavbarLink {...link} key={link.label} />)

  const logout = async () => {
    try {
      await axios.post('auth/signout')
      setAuth({
        accessToken: null,
        persist: false,
        roles: [],
        userId: null
      })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <GroupedTransition
      mounted={!open || alwaysShow}
      transitions={{
        sidebar: { duration: 400, transition: 'scale-y' },
        overlay: { duration: 300, transition: 'pop', timingFunction: 'ease' }
      }}
    >
      {(styles) => (
        <>
          <Navbar width={{ base: 60 }} hidden={open} hiddenBreakpoint="sm" style={styles.sidebar}>
            <Navbar.Section grow mt={20}>
              <Group direction="column" align="center" spacing={2}>
                {links}
              </Group>
            </Navbar.Section>
            <Navbar.Section mb={10}>
              <Group direction="column" align="center" spacing={1}>
                <NavbarLink icon={Settings} label="Configuración" route="/settings" />

                <NavbarIcon icon={Logout} label="Deconectate" onClick={logout} />
              </Group>
            </Navbar.Section>
          </Navbar>
          {!alwaysShow && (
            <Overlay
              style={styles.overlay}
              zIndex={99}
              blur={1}
              color={theme.colorScheme === 'dark' ? '#000' : '#fff'}
              onClick={() => setOpen(true)}
            />
          )}
        </>
      )}
    </GroupedTransition>
  )
}

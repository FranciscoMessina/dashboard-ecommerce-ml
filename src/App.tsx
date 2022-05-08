import {
  Center,
  ColorScheme,
  ColorSchemeProvider,
  Global,
  Loader,
  MantineProvider
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import React, { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import { Route, Routes } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { authAtom } from './atoms/authAtom.js'
import { PersistLogin } from './components/auth/PersistLogin'
import { RequireAuth } from './components/auth/RequireAuth'
import Unauthorized from './components/auth/Unauthorized'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import './styles/global.css'

const Questions = React.lazy(() => import('./pages/Questions'))
const QuestionsHistory = React.lazy(() => import('./pages/QuestionsHistory'))
const Sales = React.lazy(() => import('./pages/Sales'))
const Settings = React.lazy(() => import('./pages/Settings'))
const Publicator = React.lazy(() => import('./pages/Publicator'))
const MeliCallback = React.lazy(() => import('./pages/MeliCallback'))
const MeliLink = React.lazy(() => import('./pages/MeliLink'))

const ROLES = {
  User: 2001,
  Editor: 1984,
  Admin: 5150
}

function App() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'light'
  })
  const auth = useRecoilValue(authAtom)
  const queryClient = useQueryClient()

  useEffect(() => {
    if (auth.user) {
      const source = new EventSource(
        `${import.meta.env.VITE_API_URL}meli/updates?id=${auth.user}`,
        {
          withCredentials: true
        }
      )

      source.onopen = () => {
        console.log('Connected to events')
      }

      source.onmessage = (ev) => {
        console.log(JSON.parse(ev.data))

        // TODO: Test different accounts receiving events.

        const notification = JSON.parse(ev.data)

        if (notification.topic === 'questions') {
          setTimeout(
            () =>
              queryClient.refetchQueries(['questions'], {
                active: true
              }),
            500
          )
        }
      }
    }
  }, [auth])

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme((curr) => (curr === 'dark' ? 'light' : 'dark'))

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
        <NotificationsProvider>
          <ModalsProvider>
            <Routes>
              <Route element={<PersistLogin />}>
                {/* Public routes */}
                <Route path="auth/signin" element={<SignIn />} />
                <Route path="auth/signup" element={<SignUp />} />
                <Route path="auth/unauthorized" element={<Unauthorized />} />

                <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                  <Route
                    path="auth/link-meli"
                    element={
                      <React.Suspense
                        fallback={
                          <Center>
                            <Loader />
                          </Center>
                        }
                      >
                        <MeliLink />
                      </React.Suspense>
                    }
                  />
                  <Route
                    path="auth/callback"
                    element={
                      <React.Suspense
                        fallback={
                          <Center>
                            <Loader />
                          </Center>
                        }
                      >
                        <MeliCallback />
                      </React.Suspense>
                    }
                  />
                </Route>

                {/* Protected Routes */}

                <Route path="/" element={<Layout />}>
                  <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
                    <Route path="/" element={<Home />} />

                    <Route
                      path="questions"
                      element={
                        <React.Suspense
                          fallback={
                            <Center>
                              <Loader />
                            </Center>
                          }
                        >
                          <Questions />
                        </React.Suspense>
                      }
                    />

                    <Route
                      path="questions/history"
                      element={
                        <React.Suspense
                          fallback={
                            <Center>
                              <Loader />
                            </Center>
                          }
                        >
                          <QuestionsHistory />
                        </React.Suspense>
                      }
                    />

                    <Route
                      path="sales"
                      element={
                        <React.Suspense
                          fallback={
                            <Center>
                              <Loader />
                            </Center>
                          }
                        >
                          <Sales />
                        </React.Suspense>
                      }
                    />

                    <Route
                      path="settings"
                      element={
                        <React.Suspense
                          fallback={
                            <Center>
                              <Loader />
                            </Center>
                          }
                        >
                          <Settings />
                        </React.Suspense>
                      }
                    />

                    <Route
                      path="publish"
                      element={
                        <React.Suspense
                          fallback={
                            <Center>
                              <Loader />
                            </Center>
                          }
                        >
                          <Publicator />
                        </React.Suspense>
                      }
                    />
                  </Route>
                </Route>
              </Route>
            </Routes>
            <Global
              styles={(theme) => ({
                '::-webkit-scrollbar': {
                  width: '6px'
                },
                '::-webkit-scrollbar-track': {
                  background: 'transparent'
                },
                '::-webkit-scrollbar-thumb ': {
                  background: '#888',
                  borderRadius: '10px'
                },
                '::-webkit-scrollbar-thumb:hover': {
                  background: '#555'
                }
              })}
            />
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default App

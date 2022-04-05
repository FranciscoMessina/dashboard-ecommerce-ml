import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { SignIn } from './pages/SignIn'
import { SignUp } from './pages/SignUp'
import { Home } from './pages/Home'
import { Center, ColorScheme, ColorSchemeProvider, Loader, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AddPostAnswerModal } from './components/modals/AddPostAnswerModal'
import { AddPreAnswerModal } from './components/modals/AddPreAnswerModal'
import { AddQuickAnswerModal } from './components/modals/AddQuickAnswerModal'
import { EditPostAnswerModal } from './components/modals/EditPostAnswerModal'
import { EditPreAnswerModal } from './components/modals/EditPreAnswerModal'
import { EditQuickAnswerModal } from './components/modals/EditQuickAnswerModal'
import { useLocalStorage } from '@mantine/hooks'
import { PersistLogin } from './components/auth/PersistLogin'
import Unauthorized from './components/auth/Unauthorized'
import { Missing } from './pages/Missing'
import React from 'react'
import { RequireAuth } from './components/auth/RequireAuth'

const Questions = React.lazy(() => import('./pages/Questions'))
const Sales = React.lazy(() => import('./pages/Sales'))
const Settings = React.lazy(() => import('./pages/Settings'))
const Publicator = React.lazy(() => import('./pages/Publicator'))

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

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        staleTime: 1000 * 20
      }
    }
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme((curr) => (curr === 'dark' ? 'light' : 'dark'))

  return (
    <QueryClientProvider client={queryClient}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
          <NotificationsProvider>
            <ModalsProvider
              modals={{
                addQuickAnswer: AddQuickAnswerModal,
                editQuickAnswer: EditQuickAnswerModal,
                addPreAnswer: AddPreAnswerModal,
                editPreAnswer: EditPreAnswerModal,
                addPostAnswer: AddPostAnswerModal,
                editPostAnswer: EditPostAnswerModal
              }}
            >
              <Routes>
                {/* Public routes */}
                <Route path="auth/login" element={<SignIn />} />
                <Route path="auth/register" element={<SignUp />} />
                <Route path="auth/unauthorized" element={<Unauthorized />} />
                  {/* Protected Routes */}

                <Route path="/" element={<Layout />}>
                  <Route element={<PersistLogin />}>
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

                <Route path="*" element={<Missing />} />
              </Routes>
            </ModalsProvider>
          </NotificationsProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </QueryClientProvider>
  )
}

export default App

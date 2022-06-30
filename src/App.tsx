import {
   ColorScheme,
   ColorSchemeProvider,
   Global,
   Loader,
   MantineProvider
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Unauthorized from './pages/Unauthorized'
import { Layout } from './components/layouts/GeneralLayout'
import { QuestionsPageLayout } from './components/layouts/QuestionsPageLayout.js'
import { PersistLogin, RequireAuth, UpdatesHandler } from './components/utils'
import Billing from './pages/billing-pending.page'
import { Home } from './pages/home.page'
import { Missing } from './pages/not-found.page.js'
import { SignIn } from './pages/sign-in.page'
import { SignUp } from './pages/sign-up.page'
import NewInvoice from './pages/new-invoice'
import PageSelect from './pages/PageSelect'
import { BillingLayout } from './components/layouts/BillingLayout'
import { ItemsPage } from './pages/ItemsPage'

const PendingQuestions = React.lazy(() => import('./pages/questions.page'))
const QuestionsHistory = React.lazy(() => import('./pages/questions-history.page'))
const Sales = React.lazy(() => import('./pages/orders.page'))
const Settings = React.lazy(() => import('./pages/auto-message.page'))
const MeliCallback = React.lazy(() => import('./pages/meli-callback.page'))
const MeliLink = React.lazy(() => import('./pages/meli-link.page'))

enum Roles {
   User = 2001,
   Editor = 1984,
   Admin = 5150
}

function App() {
   const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
      key: 'color-scheme',
      defaultValue: 'light'
   })

   const toggleColorScheme = (value?: ColorScheme) =>
      setColorScheme((curr) => (curr === 'dark' ? 'light' : 'dark'))

   return (
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
         <MantineProvider theme={{ colorScheme }} withNormalizeCSS withGlobalStyles>
            <NotificationsProvider>
               <ModalsProvider>
                  <UpdatesHandler />
                  <Routes>
                     <Route element={<PersistLogin />}>
                        {/* Public routes */}
                        <Route path="auth/signin" element={<SignIn />} />
                        <Route path="auth/signup" element={<SignUp />} />
                        <Route path="auth/unauthorized" element={<Unauthorized />} />

                        <Route element={<RequireAuth allowedRoles={[Roles.User]} />}>
                           <Route
                              path="auth/link-meli"
                              element={
                                 <Suspense fallback={<Loader />}>
                                    <MeliLink />
                                 </Suspense>
                              }
                           />
                           <Route
                              path="auth/callback"
                              element={
                                 <Suspense fallback={<Loader />}>
                                    <MeliCallback />
                                 </Suspense>
                              }
                           />
                        </Route>

                        {/* Protected Routes */}

                        <Route path="/" element={<Layout />}>
                           <Route element={<RequireAuth allowedRoles={[Roles.User]} />}>
                              <Route path="/" element={<Home />} />

                              <Route path="questions" element={<QuestionsPageLayout />}>
                                 <Route index element={<PendingQuestions />} />
                                 <Route path="history" element={<QuestionsHistory />} />
                                 <Route path="pending" element={<PendingQuestions />} />
                                 <Route path="*" element={<Missing />} />
                              </Route>

                              <Route path="orders" element={<Sales />} />
                              <Route path="items" element={<ItemsPage />} />

                              <Route path="automessages" element={<Settings />} />
                              <Route path="menu" element={<PageSelect />} />

                              <Route path='billing' element={<BillingLayout />}>
                                 <Route index element={<Billing />} />
                                 <Route path="pending" element={<Billing />} />
                                 <Route path="emitted" element={<Billing />} />
                              </Route>
                              <Route path="billing/new" element={<NewInvoice />} />
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

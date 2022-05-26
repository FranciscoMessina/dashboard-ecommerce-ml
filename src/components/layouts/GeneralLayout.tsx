import { AppShell, Center, Loader } from '@mantine/core'
import { SpotlightProvider, useSpotlight } from '@mantine/spotlight'
import React, { Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Notes, ShoppingCart } from 'tabler-icons-react'
import { Sidebar } from '../ui'
import { Topbar } from '../ui'

interface LayoutProps { }

export const Layout: React.FC<LayoutProps> = () => {
   return (
      <SpotlightProvider
         actions={[]}
         nothingFoundMessage="No se encontró nada..."
         shortcut={['mod + k', 'mod + /']}
      >
         <AppShell
            padding="md"
            fixed
            navbarOffsetBreakpoint="sm"
            navbar={<Sidebar />}
            header={<Topbar />}
            zIndex={100}
            styles={(theme) => ({
               main: {
                  backgroundColor:
                     theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1]
               }
            })}
         >
            <SpotlightHandler />
            <Suspense fallback={<Center><Loader /></Center>}>
               <Outlet />
            </Suspense>
         </AppShell>
      </SpotlightProvider>
   )
}

const SpotlightHandler: React.FC<any> = ({ children }) => {
   const { query, registerActions, removeActions } = useSpotlight()
   const navigate = useNavigate()

   useEffect(() => {
      if (query) {
         registerActions([
            {
               id: 'buscar-en-ventas',
               title: `Buscar '${query}' en ventas`,
               icon: <ShoppingCart />,
               onTrigger: (action) => {
                  window.open(
                     `https://www.mercadolibre.com.ar/ventas/listado?actions&encryptSelect&filters=&page=1&search=${query}&sort=DATE_CLOSED_DESC`,
                     'mercadolibre'
                  )
               }
            },
            {
               id: 'buscar-en-publicaciones',
               title: `Buscar '${query}' en publicaciones`,
               icon: <Notes />,
               onTrigger: (action) => {
                  window.open(
                     `https://www.mercadolibre.com.ar/publicaciones/listado?page=1&search=${query}&sort=DEFAULT`,
                     'mercadolibre'
                  )
               }
            }
         ])
      }

      return () => removeActions(['buscar-en-ventas', 'buscar-en-publicaciones'])
   }, [query])

   return null
}

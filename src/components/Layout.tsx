import { AppShell, Center, ScrollArea } from '@mantine/core'
import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ScrollArea sx={{ height: '100vh' }} scrollbarSize={6} >
      <AppShell
        padding="md"
        fixed
        navbarOffsetBreakpoint="sm"
        navbar={<Sidebar />}
        header={<Topbar />}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
          }
        })}
      >
        <Outlet />
      </AppShell>
    </ScrollArea>
  )
}

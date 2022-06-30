import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './styles/global.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot } from 'recoil'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 20
    }
  }
})

ReactDOM.render(
  <BrowserRouter>
    <RecoilRoot>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
        <ReactQueryDevtools position='bottom-right' />
      </QueryClientProvider>
    </RecoilRoot>
  </BrowserRouter>,
  document.getElementById('root')
)

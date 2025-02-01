import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import { BrowserRouter,Routes,Route, Outlet } from 'react-router-dom'
import { ThemeProvider } from './Components/themeprovider.jsx'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
const queryClient = new QueryClient(
  {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }
);
createRoot(document.getElementById('root')).render(
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App/>
        </QueryClientProvider>
      </BrowserRouter>
    </ThemeProvider>,
)

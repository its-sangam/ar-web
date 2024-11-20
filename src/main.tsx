// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CookiesProvider } from 'react-cookie'
import { UserProvider } from '@/providers/UserProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <CookiesProvider>
    <UserProvider>
      <App />
    </UserProvider>
    </CookiesProvider>
)

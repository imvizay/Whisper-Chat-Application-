import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// tanstack query setup
import { QueryClient ,QueryClientProvider} from '@tanstack/react-query'
const queryClient = new QueryClient()

// routing setup
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>

   <QueryClientProvider client={queryClient}>
         <App />
   </QueryClientProvider>
   
  </BrowserRouter>
)

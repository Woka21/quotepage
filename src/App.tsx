import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'
import Index from '@/pages/Index'
import Auth from '@/pages/Auth'
import PublicQuote from '@/pages/PublicQuote'
import Dashboard from '@/pages/Dashboard'
import Onboarding from '@/pages/Onboarding'
import QuotesNew from '@/pages/QuotesNew'
import Settings from '@/pages/Settings'
import NotFound from '@/pages/NotFound'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/q/:token" element={<PublicQuote />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/quotes/new" element={<QuotesNew />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  )
}

export default App

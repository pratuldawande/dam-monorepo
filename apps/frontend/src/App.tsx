import ErrorBoundary from '@/components/ErrorBoundary'
import QueryProvider from '@/providers/QueryProvider'
import AppRouter from '@/router/AppRouter'

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AppRouter />
      </QueryProvider>
    </ErrorBoundary>
  )
}

export default App

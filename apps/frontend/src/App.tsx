import AppRouter from './router/AppRouter'
import ErrorBoundary from './components/ErrorBoundary'
import QueryProvider from './providers/QueryProvider'

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

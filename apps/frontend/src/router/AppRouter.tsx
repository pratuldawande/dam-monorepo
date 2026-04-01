import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import MainLayout from '@/layout/MainLayout'
import Assets from '@/pages/Assets'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import Register from '@/pages/Register'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/assets" element={<Assets />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter

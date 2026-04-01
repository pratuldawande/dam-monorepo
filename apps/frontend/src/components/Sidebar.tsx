import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import '@/styles/sidebar.css'

const Sidebar = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const { logout, logoutLoading, user } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      navigate('/login')
    }
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button className="menu-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Overlay */}
      {isOpen && <div className="overlay" onClick={closeSidebar}></div>}

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-top">
          <h2 className="logo">Project Portal</h2>
          {user && <p className="sidebar-link">{user.name}</p>}

          <nav>
            <NavLink to="/assets" className="sidebar-link" onClick={closeSidebar}>
              Assets
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout} disabled={logoutLoading}>
            {logoutLoading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar

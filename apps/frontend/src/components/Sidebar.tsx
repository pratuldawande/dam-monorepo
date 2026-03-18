import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../styles/sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

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

          <nav>
            <NavLink
              to="/projects"
              className="sidebar-link"
              onClick={closeSidebar}
            >
              Projects
            </NavLink>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/layout.css';

const MainLayout = () => {
  return (
    <div className="layout">
      <Sidebar />

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;

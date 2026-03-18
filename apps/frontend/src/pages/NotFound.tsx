import { Link } from 'react-router-dom';
import '../styles/notFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-card">
        <h1 className="notfound-code">404</h1>

        <h2 className="notfound-title">Page Not Found</h2>

        <p className="notfound-text">
          The page you are looking for does not exist.
        </p>

        <Link to="/">
          <button className="notfound-button">Go Home</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

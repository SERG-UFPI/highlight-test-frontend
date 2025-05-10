import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-light py-3">
      <div className="container">
        <h1 className="text-primary">HighLight Test Code</h1>
        <nav className="navbar navbar-expand-lg navbar-light">
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/community" className="nav-link">Community</Link>
              </li>
              {!localStorage.getItem('token') ? (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Sign In</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">Sign Up</Link>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link to="/repositories" className="nav-link">My Repositories</Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
        {localStorage.getItem('token') && (
          <div className="ms-auto col-md-1">
            <button onClick={handleLogout} className="btn btn-danger btn-sm">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
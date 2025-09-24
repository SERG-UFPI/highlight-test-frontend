import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isLogged = !!localStorage.getItem("token");

  return (
    <header className="bg-light">
      <nav className="navbar navbar-expand-lg navbar-light container">
        {/* Brand / título */}
        <Link to="/" className="navbar-brand fw-semibold text-primary me-3">
          HighLight Test Code
        </Link>

        {/* Botão toggler (necessário para mostrar/ocultar o menu no mobile) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Área colapsável (precisa ter um id que o toggler referencia) */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/community" className="nav-link">Community</Link>
            </li>

            {!isLogged ? (
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

          {/* Ações à direita */}
          {isLogged && (
            <div className="d-flex">
              <button onClick={handleLogout} className="btn btn-danger btn-sm">
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
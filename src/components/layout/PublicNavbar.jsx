import { Link, useLocation } from 'react-router-dom';
import { BookHeart, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const PublicNavbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isAuthPage = isLoginPage || isRegisterPage;

  return (
    <header className="public-navbar">
      <div className="public-navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="public-nav-brand">
          <BookHeart size={26} className="brand-logo-icon" />
          <span className="brand-name">DevNotas</span>
          <span className="brand-pro-tag">
            <Sparkles size={11} /> PRO
          </span>
        </Link>

        {/* Center navigation links (only on landing page) */}
        {!isAuthPage && (
          <nav className="public-nav-links">
            <a href="#caracteristicas" className="public-nav-link">Características</a>
            <a href="#codigo" className="public-nav-link">Editor & Sintaxis</a>
            <a href="#seguridad" className="public-nav-link">Nube Segura</a>
          </nav>
        )}

        {/* Right actions */}
        <div className="public-nav-actions">
          {user ? (
            <Link to="/" className="btn btn-primary btn-sm">
              Ir a mis Notas
            </Link>
          ) : isLoginPage ? (
            <div className="public-nav-auth-switch">
              <span className="auth-switch-text">¿No tienes cuenta?</span>
              <Link to="/register" className="btn btn-primary btn-sm" title="Registrarse">
                <UserPlus size={16} />
                <span className="nav-btn-text">Registrarse</span>
                <span className="nav-btn-text-mobile">Registro</span>
              </Link>
            </div>
          ) : isRegisterPage ? (
            <div className="public-nav-auth-switch">
              <span className="auth-switch-text">¿Ya tienes cuenta?</span>
              <Link to="/login" className="btn btn-outline btn-sm" title="Iniciar Sesión">
                <LogIn size={16} />
                <span className="nav-btn-text">Iniciar Sesión</span>
                <span className="nav-btn-text-mobile">Entrar</span>
              </Link>
            </div>
          ) : (
            <div className="public-nav-buttons">
              <Link to="/login" className="btn-nav-login" title="Iniciar Sesión">
                <LogIn size={16} />
                <span className="nav-btn-text">Iniciar Sesión</span>
                <span className="nav-btn-text-mobile">Entrar</span>
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" title="Comenzar gratis">
                <UserPlus size={16} />
                <span className="nav-btn-text">Comenzar gratis</span>
                <span className="nav-btn-text-mobile">Registro</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


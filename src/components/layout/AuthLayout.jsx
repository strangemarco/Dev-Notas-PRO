import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PublicNavbar } from './PublicNavbar';

export const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="layout-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  // Si el usuario ya está autenticado, lo redirigimos a la aplicación de notas
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-dedicated-wrapper">
      {/* Navbar superior */}
      <PublicNavbar />

      {/* Luces y efectos de fondo dinámicos */}
      <div className="auth-glow-spot glow-top-left"></div>
      <div className="auth-glow-spot glow-bottom-right"></div>
      <div className="auth-glow-spot glow-center"></div>

      {/* Contenedor centralizado para el formulario de Login / Registro */}
      <main className="auth-dedicated-main">
        <div className="auth-centered-box">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

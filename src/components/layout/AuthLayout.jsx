import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="layout-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  // Si el usuario ya está autenticado, lo redirigimos a la app principal
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <header className="auth-header">
          <h1>DevNotas</h1>
          <p>Tus ideas y fragmentos de código en la nube</p>
        </header>
        <main className="auth-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

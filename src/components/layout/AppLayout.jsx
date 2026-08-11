import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const AppLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="layout-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  // Si el usuario NO está autenticado, lo enviamos al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-layout">
      {/* Aquí irá el Sidebar de notas más adelante */}
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
};

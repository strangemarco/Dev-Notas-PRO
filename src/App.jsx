import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useAuth } from './hooks/useAuth';

// Layouts
import { AuthLayout } from './components/layout/AuthLayout';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotesPage } from './pages/NotesPage';

// Styles
import './styles/index.css';
import './styles/landing.css';

// Controlador de ruta raíz: Landing Page si no hay sesión, App de notas si hay sesión
const RootPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="layout-loading">
        <p>Cargando...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="app-layout">
        <main className="app-content">
          <NotesPage />
        </main>
      </div>
    );
  }

  return <LandingPage />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Ruta Raíz */}
            <Route path="/" element={<RootPage />} />

            {/* Rutas de autenticación dedicadas */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Rutas protegidas explícitas */}
            <Route element={<AppLayout />}>
              <Route path="/app" element={<NotesPage />} />
              <Route path="/notes" element={<NotesPage />} />
            </Route>

            {/* Ruta por defecto o 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

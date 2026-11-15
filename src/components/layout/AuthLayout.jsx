import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  BookHeart, 
  Code2, 
  Cloud, 
  FileDown, 
  Palette, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const AuthLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isRegister = location.pathname.includes('register');

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

  const features = [
    {
      icon: <Code2 size={22} className="feat-icon" />,
      title: 'Bloques de Código con Sintaxis',
      description: 'Highlighting automático para JS, Python, SQL, C#, HTML y más con botón de copia rápida.'
    },
    {
      icon: <Cloud size={22} className="feat-icon" />,
      title: 'Sincronización en la Nube',
      description: 'Tus notas siempre seguras y accesibles en tiempo real con Supabase y PostgreSQL.'
    },
    {
      icon: <FileDown size={22} className="feat-icon" />,
      title: 'Exportación a Markdown & PDF',
      description: 'Descarga apuntes técnicos en formato .md o genera documentos PDF en segundos.'
    },
    {
      icon: <Palette size={22} className="feat-icon" />,
      title: 'Modo Oscuro & Personalización',
      description: 'Temas ergonómicos diseñados para reducir la fatiga visual con colores de acento.'
    }
  ];

  return (
    <div className="auth-page-wrapper">
      {/* Luces y efectos de fondo dinámicos */}
      <div className="auth-glow-spot glow-top-left"></div>
      <div className="auth-glow-spot glow-bottom-right"></div>
      <div className="auth-glow-spot glow-center"></div>

      <div className="auth-content-container">
        {/* Lado izquierdo: Bienvenida, Información y Cards de qué trata la web */}
        <section className="auth-welcome-column">
          {/* Logo y Marca */}
          <div className="auth-brand-pill">
            <BookHeart size={26} className="brand-logo-icon" />
            <span className="brand-name">DevNotas</span>
            <span className="brand-pro-tag">
              <Sparkles size={11} /> PRO
            </span>
          </div>

          {/* Titular de bienvenida */}
          <div className="auth-hero-heading">
            <h1>
              El espacio de notas creado <span className="highlight-text">para programadores</span>
            </h1>
            <p className="auth-hero-desc">
              Organiza tus snippets de código, apuntes técnicos, consultas de bases de datos y documentación en un entorno rápido, seguro y minimalista.
            </p>
          </div>

          {/* Mini tarjeta de previsualización de código */}
          <div className="auth-snippet-mockup">
            <div className="snippet-window-header">
              <div className="window-controls">
                <span className="window-dot dot-close"></span>
                <span className="window-dot dot-minimize"></span>
                <span className="window-dot dot-expand"></span>
              </div>
              <span className="window-tab-title">devnotas.config.ts</span>
              <span className="window-lang-badge">TypeScript</span>
            </div>
            <pre className="snippet-code-box">
              <code>
                <span className="syntax-keyword">const</span> <span className="syntax-const">miEspacioDev</span> = {'{\n'}
                {'  '}plataforma: <span className="syntax-string">"DevNotas PRO"</span>,{'\n'}
                {'  '}autoguardado: <span className="syntax-boolean">true</span>,{'\n'}
                {'  '}lenguajes: [<span className="syntax-string">"SQL"</span>, <span className="syntax-string">"JavaScript"</span>, <span className="syntax-string">"Python"</span>],{'\n'}
                {'  '}cloudSync: <span className="syntax-string">"Supabase RLS 🔒"</span>{'\n'}
                {'}'};
              </code>
            </pre>
          </div>

          {/* Cards de información sobre la plataforma */}
          <div className="auth-info-cards-grid">
            {features.map((item, idx) => (
              <div key={idx} className="auth-info-card">
                <div className="info-card-icon-wrap">
                  {item.icon}
                </div>
                <div className="info-card-text">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Píldoras de confianza */}
          <div className="auth-trust-strip">
            <div className="trust-item">
              <Zap size={14} /> Autoguardado instantáneo
            </div>
            <div className="trust-item">
              <ShieldCheck size={14} /> Auth Segura con RLS
            </div>
            <div className="trust-item">
              <CheckCircle2 size={14} /> 100% Gratuito
            </div>
          </div>
        </section>

        {/* Lado derecho: Formulario de Login / Registro */}
        <section className="auth-form-column">
          <div className="auth-glass-card">
            <div className="auth-card-header">
              <div className="mobile-brand-display">
                <BookHeart size={24} className="brand-logo-icon" />
                <span className="brand-name">DevNotas PRO</span>
              </div>
              <h2 className="card-headline">
                {isRegister ? 'Crear una cuenta' : 'Iniciar Sesión'}
              </h2>
              <p className="card-subheadline">
                {isRegister 
                  ? 'Regístrate gratis y comienza a documentar tu código en la nube.'
                  : 'Ingresa a tu espacio de trabajo y continúa tus notas.'
                }
              </p>
            </div>

            <div className="auth-card-content">
              <Outlet />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

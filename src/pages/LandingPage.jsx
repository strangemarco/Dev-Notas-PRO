import { Link } from 'react-router-dom';
import { 
  Code2, 
  Cloud, 
  FileDown, 
  Palette, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  LogIn,
  Layers,
  Terminal,
  Lock
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';

export const LandingPage = () => {
  const features = [
    {
      icon: <Code2 size={24} className="feat-icon" />,
      title: 'Bloques de Código con Sintaxis',
      description: 'Highlighting automático para JavaScript, Python, SQL, HTML, CSS, TypeScript y más con botón para copiar al portapapeles en 1 clic.'
    },
    {
      icon: <Cloud size={24} className="feat-icon" />,
      title: 'Sincronización en la Nube',
      description: 'Tus notas se guardan de forma instantánea y persistente con Supabase PostgreSQL y Row Level Security (RLS).'
    },
    {
      icon: <FileDown size={24} className="feat-icon" />,
      title: 'Exportación a Markdown & PDF',
      description: 'Exporta tus apuntes técnicos en formato .md estándar para tus repositorios o descarga documentos PDF limpios en segundos.'
    },
    {
      icon: <Palette size={24} className="feat-icon" />,
      title: 'Modo Oscuro & Personalización',
      description: 'Paleta ergonómica diseñada para evitar la fatiga visual con temas personalizables y múltiples colores de acento.'
    }
  ];

  const highlights = [
    {
      icon: <Lock size={20} />,
      title: 'Seguridad RLS',
      desc: 'Cada usuario accede exclusivamente a sus notas mediante políticas estrictas a nivel de fila en la base de datos.'
    },
    {
      icon: <Zap size={20} />,
      title: 'Autoguardado en Vivo',
      desc: 'No pierdas ninguna línea. Cada cambio se guarda de fondo mientras escribes sin interrumpir tu flujo.'
    },
    {
      icon: <Layers size={20} />,
      title: 'Vista en Mosaico y Lienzo',
      desc: 'Organiza tus notas en tarjetas intuitivas y ábrelas en un lienzo de edición a pantalla completa sin distracciones.'
    }
  ];

  return (
    <div className="landing-page-root">
      {/* Navbar público */}
      <PublicNavbar />

      {/* Luces y efectos de fondo dinámicos */}
      <div className="auth-glow-spot glow-top-left"></div>
      <div className="auth-glow-spot glow-bottom-right"></div>
      <div className="auth-glow-spot glow-center"></div>

      <main className="landing-main-content">
        {/* ==============================================================
            HERO SECTION
            ============================================================== */}
        <section className="landing-hero-section">
          <div className="landing-badge-pill">
            <Sparkles size={14} className="badge-sparkle-icon" />
            <span>El espacio de notas creado para desarrolladores</span>
          </div>

          <h1 className="landing-hero-title">
            Documenta tu código y tus notas <br />
            <span className="highlight-text">sin fricción y en la nube</span>
          </h1>

          <p className="landing-hero-subtitle">
            Organiza snippets, documentación técnica, consultas SQL y apuntes en un entorno ultrarrápido, seguro y diseñado para tu día a día como programador.
          </p>

          <div className="landing-hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg landing-cta-primary">
              Comenzar gratis <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg landing-cta-secondary">
              <LogIn size={18} /> Iniciar Sesión
            </Link>
          </div>

          <div className="landing-trust-bar">
            <div className="trust-pill"><Zap size={14} /> Autoguardado instantáneo</div>
            <div className="trust-pill"><ShieldCheck size={14} /> Supabase RLS Seguro</div>
            <div className="trust-pill"><CheckCircle2 size={14} /> 100% Gratuito</div>
          </div>
        </section>

        {/* ==============================================================
            MOCKUP INTERACTIVO DE CÓDIGO
            ============================================================== */}
        <section id="codigo" className="landing-mockup-section">
          <div className="landing-code-window">
            <div className="code-window-topbar">
              <div className="window-dots">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <div className="window-title-tab">
                <Terminal size={14} />
                <span>devnotas.config.ts</span>
              </div>
              <span className="window-lang-tag">TypeScript</span>
            </div>
            <pre className="code-window-body">
              <code>
                <span className="tok-comment">// DevNotas PRO - Tu espacio de desarrollo</span>{'\n'}
                <span className="tok-keyword">import</span> {'{ createWorkspace }'} <span className="tok-keyword">from</span> <span className="tok-string">'@devnotas/core'</span>;{'\n\n'}
                <span className="tok-keyword">export const</span> <span className="tok-def">miEspacio</span> = <span className="tok-func">createWorkspace</span>({'{'}{'\n'}
                {'  '}plataforma: <span className="tok-string">'DevNotas PRO'</span>,{'\n'}
                {'  '}sincronizacionNube: <span className="tok-bool">true</span>,{'\n'}
                {'  '}resaltadoSintaxis: [<span className="tok-string">'JavaScript'</span>, <span className="tok-string">'Python'</span>, <span className="tok-string">'SQL'</span>, <span className="tok-string">'HTML'</span>],{'\n'}
                {'  '}seguridad: <span className="tok-string">'Supabase Row Level Security 🔒'</span>,{'\n'}
                {'  '}exportarA: [<span className="tok-string">'.md'</span>, <span className="tok-string">'.pdf'</span>]{'\n'}
                {'}'});
              </code>
            </pre>
          </div>
        </section>

        {/* ==============================================================
            CARDS INFORMATIVAS (FEATURES)
            ============================================================== */}
        <section id="caracteristicas" className="landing-features-section">
          <div className="section-header-center">
            <div className="section-tag">CARACTERÍSTICAS</div>
            <h2 className="section-title">Diseñado para el flujo de trabajo del programador</h2>
            <p className="section-subtitle">
              Olvídate de notas dispersas o editores pesados. Aquí tienes todo lo esencial listo en tu navegador.
            </p>
          </div>

          <div className="landing-features-grid">
            {features.map((item, index) => (
              <div key={index} className="landing-feature-card">
                <div className="feature-card-icon">
                  {item.icon}
                </div>
                <h3 className="feature-card-title">{item.title}</h3>
                <p className="feature-card-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==============================================================
            SECCIÓN DE SEGURIDAD Y CONFIANZA
            ============================================================== */}
        <section id="seguridad" className="landing-security-section">
          <div className="section-header-center">
            <div className="section-tag">ARQUITECTURA & SEGURIDAD</div>
            <h2 className="section-title">Construido sobre tecnología moderna y confiable</h2>
          </div>

          <div className="landing-highlights-grid">
            {highlights.map((h, i) => (
              <div key={i} className="highlight-card">
                <div className="highlight-icon-box">{h.icon}</div>
                <h4 className="highlight-title">{h.title}</h4>
                <p className="highlight-desc">{h.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==============================================================
            CALL TO ACTION BANNER FINAL
            ============================================================== */}
        <section className="landing-cta-banner-section">
          <div className="landing-cta-banner">
            <div className="cta-banner-glow"></div>
            <div className="cta-banner-content">
              <h2>¿Listo para organizar tus notas y snippets?</h2>
              <p>Crea tu cuenta gratis en menos de un minuto con Google o correo electrónico.</p>
              <div className="cta-banner-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">
                  Crear Cuenta Gratis <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ==============================================================
          FOOTER MINIMALISTA
          ============================================================== */}
      <footer className="landing-footer">
        <div className="landing-footer-container">
          <div className="footer-brand">
            <span className="brand-name">DevNotas <span className="pro-pill">PRO</span></span>
            <p className="footer-tagline">El espacio de notas creado para programadores.</p>
          </div>

          <div className="footer-links">
            <a href="#caracteristicas">Características</a>
            <a href="#codigo">Sintaxis</a>
            <a href="#seguridad">Seguridad</a>
            <Link to="/login">Iniciar Sesión</Link>
            <Link to="/register">Registrarse</Link>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} DevNotas PRO. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

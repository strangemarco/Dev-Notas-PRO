import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserPlus, User, Mail, Lock } from 'lucide-react';

export const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await authService.loginWithGoogle();
    } catch (err) {
      console.error(err);
      setError(err?.message || 'Error al conectar con Google.');
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.register(email, password, fullName);
      navigate('/');
    } catch (err) {
      console.error(err);
        const msg = err?.message?.toLowerCase() || '';
        if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already registered')) {
          setError('Este correo ya está registrado en la base de datos.');
        } else if (msg.includes('networkerror') || msg.includes('failed to fetch') || msg.includes('fetch')) {
          setError('No se pudo conectar con el servidor de Supabase. Revisa si el proyecto está activo o la configuración de red.');
        } else {
          setError(err.message || 'Error al registrar la cuenta.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="auth-form-container">
        <h2>Crear Cuenta</h2>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="fullName">Nombre completo</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Tu Nombre"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <input
              id="acceptTerms"
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              required
              style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
            />
            <label htmlFor="acceptTerms" style={{ margin: 0, fontSize: '0.9rem', cursor: 'pointer', fontWeight: '500', color: 'var(--text-secondary)' }}>
              Aceptar términos y condiciones
            </label>
          </div>

          <button type="submit" disabled={isLoading || isGoogleLoading} className="btn btn-primary btn-block">
            {isLoading ? 'Creando cuenta...' : (
              <>
                <UserPlus size={20} /> Registrarse
              </>
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>o continúa con</span>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}
          className="btn-google"
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          {isGoogleLoading ? 'Conectando con Google...' : 'Continuar con Google'}
        </button>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    );
  };

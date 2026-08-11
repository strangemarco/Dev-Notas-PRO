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
  const navigate = useNavigate();

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
      if (err.message && (err.message.toLowerCase().includes('already registered') || err.message.toLowerCase().includes('already exists'))) {
        setError('Este correo ya está registrado en la base de datos.');
      } else {
        setError('Error al registrar la cuenta. Es posible que el correo ya esté en uso.');
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

        <button type="submit" disabled={isLoading} className="btn btn-primary btn-block">
          {isLoading ? 'Creando cuenta...' : (
            <>
              <UserPlus size={20} /> Registrarse
            </>
          )}
        </button>
      </form>
      
      <p className="auth-footer">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </div>
  );
};

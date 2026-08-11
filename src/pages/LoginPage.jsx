import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { LogIn, Mail, Lock } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Credenciales incorrectas o ha ocurrido un error.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Iniciar Sesión</h2>
      
      {error && <div className="alert error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
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

        <button type="submit" disabled={isLoading} className="btn btn-primary btn-block">
          {isLoading ? 'Iniciando...' : (
            <>
              <LogIn size={20} /> Entrar
            </>
          )}
        </button>
      </form>
      
      <p className="auth-footer">
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </p>
    </div>
  );
};

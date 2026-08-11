import { useState, useContext, useRef } from 'react';
import { X, User, Palette, Check, Camera } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { ThemeContext } from '../../contexts/ThemeContext';
import Swal from 'sweetalert2';

export const SettingsModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { theme, setTheme, accentColor, setAccentColor } = useContext(ThemeContext);
  
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' or 'appearance'
  
  // Profile form state
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const publicUrl = await authService.uploadAvatar(file, user.id);
      setAvatarUrl(publicUrl);
    } catch (error) {
      console.error("Error al subir avatar:", error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Error al subir la imagen',
        showConfirmButton: false,
        timer: 3000,
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await authService.updateProfile({ 
        full_name: fullName, 
        avatar_url: avatarUrl 
      });
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Perfil actualizado exitosamente',
        showConfirmButton: false,
        timer: 3000,
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)'
      });
      // The auth context will eventually update if we listen to changes, 
      // but a quick reload or state update is better. For now we just show success.
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Error al actualizar',
        showConfirmButton: false,
        timer: 3000,
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)'
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const colors = [
    { id: 'black', hex: '#111827', name: 'Negro / Gris Oscuro' },
    { id: 'red', hex: '#e11d48', name: 'Rojo DevNotas' },
    { id: 'blue', hex: '#3b82f6', name: 'Azul' },
    { id: 'green', hex: '#10b981', name: 'Verde' },
    { id: 'yellow', hex: '#f59e0b', name: 'Amarillo' },
    { id: 'pink', hex: '#ec4899', name: 'Rosa' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Configuración</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-sidebar">
            <button 
              className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} /> Perfil
            </button>
            <button 
              className={`settings-tab ${activeTab === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveTab('appearance')}
            >
              <Palette size={18} /> Apariencia
            </button>
          </div>

          <div className="settings-content">
            {activeTab === 'profile' && (
              <div className="settings-panel">
                <h3>Datos Personales</h3>
                
                <div className="avatar-upload-container">
                  <div 
                    className="avatar-preview-large" 
                    onClick={() => fileInputRef.current?.click()}
                    style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : {}}
                  >
                    {!avatarUrl && <span className="avatar-initial">{fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0).toUpperCase()}</span>}
                    <div className="avatar-overlay">
                      <Camera size={24} />
                    </div>
                    {isUploading && (
                      <div className="avatar-loading">
                        <div className="spinner"></div>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                  />
                  <p className="avatar-help-text">Haz clic para cambiar tu foto</p>
                </div>

                <form onSubmit={handleSaveProfile} className="settings-form">
                  <div className="form-group">
                    <label>Correo Electrónico (No editable)</label>
                    <input type="text" value={user?.email || ''} disabled className="input-disabled" />
                  </div>
                  <div className="form-group">
                    <label>Nombre Completo</label>
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)} 
                      placeholder="Tu nombre..."
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={isSavingProfile}>
                    {isSavingProfile ? 'Guardando...' : 'Guardar Cambios'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="settings-panel">
                <h3>Apariencia de la aplicación</h3>
                
                <div className="settings-section">
                  <h4>Tema</h4>
                  <div className="theme-options">
                    <button 
                      className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                      onClick={() => setTheme('light')}
                    >
                      <div className="theme-preview light-preview"></div>
                      Claro
                    </button>
                    <button 
                      className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                      onClick={() => setTheme('dark')}
                    >
                      <div className="theme-preview dark-preview"></div>
                      Oscuro
                    </button>
                    <button 
                      className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                      onClick={() => setTheme('system')}
                    >
                      <div className="theme-preview system-preview"></div>
                      Sistema
                    </button>
                  </div>
                </div>

                <div className="settings-section">
                  <h4>Color de Acento</h4>
                  <div className="color-options">
                    {colors.map(c => (
                      <button 
                        key={c.id}
                        className={`color-btn ${accentColor === c.id ? 'active' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                        onClick={() => setAccentColor(c.id)}
                      >
                        {accentColor === c.id && <Check size={16} color="#fff" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

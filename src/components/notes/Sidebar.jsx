import { LogOut, Plus, BookHeart } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ onNewNote, onLogout }) => {
  const { user } = useAuth();

  return (
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <h2 className="brand">
          <BookHeart size={24} className="brand-icon" />
          DevNotas
        </h2>
      </div>

      <div className="sidebar-actions">
        <button className="btn btn-primary btn-block new-note-btn" onClick={onNewNote}>
          <Plus size={18} /> Nueva Nota
        </button>
      </div>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.user_metadata?.full_name || 'Usuario'}</span>
            <span className="user-email">{user?.email}</span>
          </div>
        </div>
        <button onClick={onLogout} className="btn-logout" title="Cerrar sesión">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

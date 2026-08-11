import { BookHeart, Plus, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const SidebarList = ({ notes, activeNoteId, onSelectNote, onNewNote, onLogout, onOpenSettings, searchQuery, setSearchQuery }) => {
  const { user } = useAuth();

  return (
    <div className="sidebar-list-container">
      <div className="sidebar-list-header">
        <h2 className="brand">
          <BookHeart size={24} className="brand-icon" />
          DevNotas
        </h2>
        <button className="btn btn-primary new-btn" onClick={onNewNote}>
          <Plus size={16} /> Nueva
        </button>
      </div>

      <div className="sidebar-list-search">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar notas..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-list-content">
        {notes.length === 0 ? (
          <div className="empty-list">No se encontraron notas.</div>
        ) : (
          notes.map(note => {
            const isActive = activeNoteId === note.id;
            const dateObj = new Date(note.updated_at || note.created_at);
            const formattedDate = dateObj.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div 
                key={note.id} 
                className={`note-card ${isActive ? 'active' : ''}`}
                onClick={() => onSelectNote(note.id)}
              >
                <h3 className="note-card-title">{note.title || 'Sin título'}</h3>
                <p className="note-card-snippet">{note.snippet || 'Sin contenido'}</p>
                <span className="note-card-date">{formattedDate}</span>
              </div>
            );
          })
        )}
      </div>

      <div className="sidebar-list-footer">
        <div className="user-info" onClick={onOpenSettings} style={{ cursor: 'pointer' }} title="Configuración de Perfil">
          <div 
            className="user-avatar"
            style={user?.user_metadata?.avatar_url ? { backgroundImage: `url(${user.user_metadata.avatar_url})`, backgroundSize: 'cover', backgroundPosition: 'center', color: 'transparent' } : {}}
          >
            {!user?.user_metadata?.avatar_url && user?.email?.charAt(0).toUpperCase()}
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

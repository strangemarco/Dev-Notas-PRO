import { useState } from 'react';
import { 
  BookHeart, 
  Plus, 
  Search, 
  LogOut, 
  Trash2, 
  Clock, 
  FileText, 
  Code, 
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const NotesGridView = ({ 
  notes, 
  onSelectNote, 
  onNewNote, 
  onDeleteNote, 
  onLogout, 
  onOpenSettings, 
  searchQuery, 
  setSearchQuery 
}) => {
  const { user } = useAuth();

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPreviewText = (note) => {
    if (note.snippet && note.snippet.trim() && note.snippet !== 'Sin contenido' && note.snippet !== 'Escribe algo increíble...') {
      return note.snippet;
    }
    if (note.plain_text && note.plain_text.trim()) {
      return note.plain_text.slice(0, 160);
    }
    if (note.content && note.content.trim()) {
      const cleanText = note.content
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (cleanText) return cleanText.slice(0, 160);
    }
    return 'Nota vacía. Haz clic para comenzar a escribir...';
  };

  const hasCode = (note) => {
    const text = note.content || '';
    return text.includes('ql-syntax') || text.includes('<pre') || text.includes('code-block');
  };

  return (
    <div className="notes-home-view">
      {/* Barra superior de navegación */}
      <header className="home-navbar">
        <div className="home-navbar-brand">
          <BookHeart size={26} className="brand-icon" />
          <div className="brand-text">
            <h1 className="brand-title">DevNotas</h1>
            <span className="brand-badge">PRO</span>
          </div>
        </div>

        {/* Buscador central */}
        <div className="home-search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por título, contenido o código..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="clear-search-btn" 
              onClick={() => setSearchQuery('')}
              title="Limpiar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Acciones del usuario */}
        <div className="home-navbar-actions">
          <button className="btn btn-primary btn-new-note" onClick={onNewNote}>
            <Plus size={18} />
            <span>Nueva Nota</span>
          </button>

          <div 
            className="user-profile-pill" 
            onClick={onOpenSettings} 
            title="Configuración de perfil"
          >
            <div 
              className="user-avatar-circle"
              style={user?.user_metadata?.avatar_url ? { 
                backgroundImage: `url(${user.user_metadata.avatar_url})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                color: 'transparent' 
              } : {}}
            >
              {!user?.user_metadata?.avatar_url && (user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase())}
            </div>
            <span className="user-profile-name">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
            </span>
          </div>

          <button 
            onClick={onLogout} 
            className="btn-icon-logout" 
            title="Cerrar sesión"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Contenido principal: Grid de Notas */}
      <main className="home-content-container">
        <div className="home-section-header">
          <div className="section-title-wrap">
            <h2>Todas tus Notas</h2>
            <span className="notes-counter-badge">
              {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
            </span>
          </div>
          {searchQuery && (
            <span className="search-result-hint">
              Mostrando resultados para: <strong>"{searchQuery}"</strong>
            </span>
          )}
        </div>

        {notes.length === 0 && searchQuery ? (
          <div className="empty-search-state">
            <Search size={48} className="empty-icon" />
            <h3>No se encontraron notas</h3>
            <p>No hay ninguna nota que coincida con "{searchQuery}"</p>
            <button className="btn btn-primary" onClick={() => setSearchQuery('')}>
              Ver todas las notas
            </button>
          </div>
        ) : (
          <div className="notes-cards-grid">
            {/* Tarjeta para crear nota rápida */}
            {!searchQuery && (
              <div className="note-card-create" onClick={onNewNote}>
                <div className="create-card-inner">
                  <div className="create-icon-wrapper">
                    <Plus size={32} />
                  </div>
                  <h3>Crear nueva nota</h3>
                  <p>Comienza a escribir ideas, código o documentación</p>
                </div>
              </div>
            )}

            {/* Listado de tarjetas de notas */}
            {notes.map((note) => {
              const preview = getPreviewText(note);
              const dateText = formatDate(note.updated_at || note.created_at);
              const isCodeNote = hasCode(note);

              return (
                <div 
                  key={note.id} 
                  className="note-card-item"
                  onClick={() => onSelectNote(note.id)}
                >
                  <div className="card-top-row">
                    <h3 className="card-note-title" title={note.title || 'Sin título'}>
                      {note.title || 'Sin título'}
                    </h3>
                    <div className="card-badges">
                      {isCodeNote && (
                        <span className="badge-code" title="Contiene fragmentos de código">
                          <Code size={13} /> Código
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="card-note-snippet">
                    {preview}
                  </p>

                  <div className="card-footer-row">
                    <div className="card-date-wrap">
                      <Clock size={13} />
                      <span>{dateText}</span>
                    </div>

                    <button 
                      className="card-delete-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteNote(note.id);
                      }}
                      title="Eliminar nota"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};


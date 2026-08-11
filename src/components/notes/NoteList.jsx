export const NoteList = ({ notes, activeNoteId, onSelectNote }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="dashboard-notelist empty">
        <p>No tienes notas aún.</p>
        <p className="empty-sub">Crea una nueva para empezar.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-notelist">
      {notes.map(note => {
        const isActive = activeNoteId === note.id;
        // Parse date
        const dateObj = new Date(note.updated_at || note.created_at);
        const formattedDate = dateObj.toLocaleDateString('es-ES', {
          month: 'short',
          day: 'numeric',
          year: dateObj.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
        });

        return (
          <div 
            key={note.id} 
            className={`note-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectNote(note.id)}
          >
            <h3 className="note-title">{note.title || 'Sin Título'}</h3>
            <p className="note-snippet">
              {note.snippet || 'Sin contenido'}
            </p>
            <span className="note-date">{formattedDate}</span>
          </div>
        );
      })}
    </div>
  );
};

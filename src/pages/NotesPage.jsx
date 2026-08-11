import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { notesService } from '../services/notesService';
import { SidebarList } from '../components/notes/SidebarList';
import { NoteEditor } from '../components/notes/NoteEditor';
import { SettingsModal } from '../components/settings/SettingsModal';
import Swal from 'sweetalert2';

export const NotesPage = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    setIsLoading(true);
    try {
      const data = await notesService.getNotes();
      setNotes(data);
      if (data.length > 0 && !activeNoteId) {
        // En móviles (<= 768px) no seleccionamos ninguna nota por defecto
        // para que se muestre primero la lista de notas.
        if (window.innerWidth > 768) {
          setActiveNoteId(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error al cargar notas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: "¿Estás seguro de que deseas salir?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: 'var(--accent-color)',
      cancelButtonColor: 'var(--text-secondary)',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      background: 'var(--bg-surface)',
      color: 'var(--text-primary)'
    });

    if (result.isConfirmed) {
      try {
        await authService.logout();
      } catch (error) {
        console.error("Error al cerrar sesión", error);
      }
    }
  };

  const handleNewNote = async () => {
    try {
      const newNote = await notesService.createNote(user.id);
      setNotes([newNote, ...notes]);
      setActiveNoteId(newNote.id);
      setSearchQuery(''); // Clear search to see the new note
    } catch (error) {
      console.error("Error creando nota:", error);
    }
  };

  const handleUpdateNote = async (id, updates) => {
    try {
      setNotes(currentNotes => 
        currentNotes.map(n => n.id === id ? { ...n, ...updates } : n)
      );
      await notesService.updateNote(id, updates);
    } catch (error) {
      console.error("Error guardando nota:", error);
    }
  };

  const handleDeleteNote = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--accent-red)',
      cancelButtonColor: 'var(--text-secondary)',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: 'var(--bg-surface)',
      color: 'var(--text-primary)'
    });

    if (!result.isConfirmed) {
      return;
    }
    
    try {
      await notesService.deleteNote(id);
      const remainingNotes = notes.filter(n => n.id !== id);
      setNotes(remainingNotes);
      if (activeNoteId === id) {
        setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
      }
      
      Swal.fire({
        title: '¡Eliminada!',
        text: 'Tu nota ha sido eliminada exitosamente.',
        icon: 'success',
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)',
        confirmButtonColor: 'var(--accent-color)'
      });
    } catch (error) {
      console.error("Error eliminando nota:", error);
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al eliminar la nota.',
        icon: 'error',
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)'
      });
    }
  };

  const filteredNotes = notes.filter(n => {
    const term = searchQuery.toLowerCase();
    return (n.title?.toLowerCase() || '').includes(term) || 
           (n.plain_text?.toLowerCase() || '').includes(term);
  });

  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className={`dashboard-container ${activeNoteId ? 'has-active-note' : ''}`}>
      {isLoading ? (
        <div className="full-screen-loading">
          <Loader size={50} className="spinner-icon" />
          <p>Cargando tus notas...</p>
        </div>
      ) : (
        <>
          <SidebarList 
            notes={filteredNotes} 
            activeNoteId={activeNoteId} 
            onSelectNote={setActiveNoteId}
            onNewNote={handleNewNote}
            onLogout={handleLogout}
            onOpenSettings={() => setIsSettingsOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <NoteEditor 
            activeNote={activeNote} 
            onUpdateNote={handleUpdateNote}
            onDeleteNote={handleDeleteNote}
            onBack={() => setActiveNoteId(null)}
          />
        </>
      )}
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </div>
  );
};

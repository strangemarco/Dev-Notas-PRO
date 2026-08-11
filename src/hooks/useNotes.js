import { useState, useEffect, useCallback } from 'react';
import { notesService } from '../services/notesService';
import { useAuth } from './useAuth';

export const useNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar notas al inicio
  useEffect(() => {
    if (!user) return;
    
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        const data = await notesService.getNotes();
        setNotes(data);
        if (data.length > 0 && !activeNoteId) {
          setActiveNoteId(data[0].id);
        }
      } catch (err) {
        console.error("Error al cargar notas:", err);
        setError("No se pudieron cargar las notas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [user]);

  const createNote = async () => {
    try {
      const newNote = await notesService.createNote(user.id);
      setNotes(prev => [newNote, ...prev]);
      setActiveNoteId(newNote.id);
      return newNote;
    } catch (err) {
      console.error("Error al crear nota:", err);
      throw err;
    }
  };

  const updateNoteLocally = useCallback((id, updates) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  }, []);

  const deleteNote = async (id) => {
    try {
      await notesService.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
      if (activeNoteId === id) {
        setActiveNoteId(null);
      }
    } catch (err) {
      console.error("Error al eliminar nota:", err);
      throw err;
    }
  };

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  return {
    notes,
    activeNote,
    activeNoteId,
    setActiveNoteId,
    isLoading,
    error,
    createNote,
    updateNoteLocally,
    deleteNote
  };
};

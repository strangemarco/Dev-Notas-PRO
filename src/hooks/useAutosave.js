import { useEffect, useRef, useState } from 'react';
import { notesService } from '../services/notesService';

export const useAutosave = (activeNoteId, noteData, isDirty) => {
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const debounceTimerRef = useRef(null);
  
  // Guardamos una referencia fresca a los datos de la nota para que 
  // el timer siempre vea la última versión sin re-crear el efecto.
  const noteDataRef = useRef(noteData);
  useEffect(() => {
    noteDataRef.current = noteData;
  }, [noteData]);

  useEffect(() => {
    if (!isDirty || !activeNoteId) return;

    setSaveStatus('saving');

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        await notesService.updateNote(activeNoteId, {
          title: noteDataRef.current.title,
          content: noteDataRef.current.content,
          plain_text: noteDataRef.current.plain_text,
          snippet: noteDataRef.current.snippet,
        });
        setSaveStatus('saved');
      } catch (error) {
        console.error("Error al autoguardar:", error);
        setSaveStatus('error');
      }
    }, 1500); // 1.5s de debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [isDirty, activeNoteId]);

  return { saveStatus };
};

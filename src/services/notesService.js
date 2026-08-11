import { supabase } from './supabaseClient';

export const notesService = {
  // Obtener todas las notas del usuario actual
  async getNotes() {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Obtener una nota por ID
  async getNoteById(id) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // Crear una nueva nota
  async createNote(userId) {
    const newNote = {
      user_id: userId,
      title: 'Nueva Nota',
      content: '',
      plain_text: '',
      snippet: 'Escribe algo increíble...',
    };

    const { data, error } = await supabase
      .from('notes')
      .insert([newNote])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Actualizar una nota existente
  async updateNote(id, updates) {
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar una nota
  async deleteNote(id) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

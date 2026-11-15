import { supabase } from './supabaseClient';

export const notesService = {
  // Obtener todas las notas exclusivamente del usuario actual
  async getNotes(userId) {
    if (!userId) {
      console.warn("notesService.getNotes llamado sin userId.");
      return [];
    }

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Obtener una nota por ID asegurando pertenencia al usuario
  async getNoteById(id, userId) {
    let query = supabase
      .from('notes')
      .select('*')
      .eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();
    if (error) throw error;
    return data;
  },

  // Crear una nueva nota para el usuario actual
  async createNote(userId) {
    if (!userId) {
      throw new Error("No hay un usuario autenticado para crear la nota.");
    }

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

  // Actualizar una nota existente del usuario
  async updateNote(id, updates, userId) {
    let query = supabase
      .from('notes')
      .update(updates)
      .eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Eliminar una nota asegurando que pertenezca al usuario
  async deleteNote(id, userId) {
    let query = supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { error } = await query;
    if (error) throw error;
    return true;
  }
};

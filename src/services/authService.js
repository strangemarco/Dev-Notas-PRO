import { supabase } from './supabaseClient';

export const authService = {
  // Iniciar sesión con email y contraseña
  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  // Registrar un nuevo usuario
  async register(email, password, fullName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  },

  // Cerrar sesión
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },
  
  // Actualizar perfil del usuario
  async updateProfile(updates) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });
    if (error) throw error;
    return data;
  },
  
  // Subir avatar
  async uploadAvatar(file, userId) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },
  
  // Obtener sesión actual
  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  // Escuchar cambios de estado de autenticación
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

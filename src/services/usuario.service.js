import { supabaseAdmin as supabase } from '../config/db.js';

export const usuarioService = {
  async getUsuariosPaginated(page = 1, limit = 20, filters = {}) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from('cuenta_usuario')
      .select('id_cuenta_usuario, username, email, rol, estado, fecha_registro', { count: 'exact' });

    if (filters.rol) query = query.eq('rol', filters.rol);
    if (filters.estado) query = query.eq('estado', filters.estado);
    // Búsqueda por texto (username o email)
    if (filters.q && filters.q.trim()) {
      query = query.or(`username.ilike.%${filters.q.trim()}%,email.ilike.%${filters.q.trim()}%`);
    }

    const { data, count, error } = await query
      .order('fecha_registro', { ascending: false })
      .range(start, end);

    if (error) throw error;
    return { usuarios: data, count, totalPages: Math.ceil((count || 0) / limit) };
  },

  async createUser(userData) {
    const { username, email, password, rol = 'lector' } = userData;

    // 1. Auth Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { username, rol }
    });
    if (authError) throw authError;

    // 2. Profile DB
    const { error: updateError } = await supabase
      .from('cuenta_usuario')
      .update({ username, rol, estado: 'activa' })
      .eq('email', email);

    if (updateError) {
      const { error: insertError } = await supabase
        .from('cuenta_usuario')
        .insert([{ username, email, rol, estado: 'activa' }]);
      if (insertError) throw insertError;
    }
    return authData;
  },

  async updateUser(id, updates) {
    const { error } = await supabase
      .from('cuenta_usuario')
      .update(updates)
      .eq('id_cuenta_usuario', id);
    if (error) throw error;
    return true;
  },

  async deleteUser(id) {
    const { error } = await supabase
      .from('cuenta_usuario')
      .delete()
      .eq('id_cuenta_usuario', id);
    if (error) throw error;
    return true;
  },

  async getDashboardTotal() {
    const { count, error } = await supabase
      .from('cuenta_usuario')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count;
  }
};

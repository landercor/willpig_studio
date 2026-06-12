import { supabaseAdmin as supabase } from '../config/db.js';

export const historiaService = {
  // Para el admin dashboard
  async getHistoriasPaginated(page = 1, limit = 20, filters = {}) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let query = supabase
      .from('cuentos')
      .select(`id_cuento, titulo, descripcion, portada_url, estado, visibilidad, audiencia, idioma, vistas, created_at, categoria_id, cuenta_usuario ( username ), capitulos ( count )`, { count: 'exact' });

    if (filters.estado) query = query.eq('estado', filters.estado);
    if (filters.categoria_id) query = query.eq('categoria_id', filters.categoria_id);

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;
    return { historias: data, count, totalPages: Math.ceil((count || 0) / limit) };
  },

  // Obtener historia por ID para edición
  async getStoryByIdForEdit(id) {
    const { data, error } = await supabase
      .from('cuentos')
      .select(`
        id_cuento, titulo, descripcion, portada_url, estado, visibilidad, audiencia, idioma, derechos, clasificacion, categoria_id, cuenta_usuario_id,
        capitulos ( id_capitulo, titulo, created_at )
      `)
      .eq('id_cuento', id)
      .single();
    if (error) throw error;
    if (data && data.capitulos) {
      data.capitulos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return data;
  },

  // Obtener historia por ID para lectura (pública)
  async getStoryByIdForRead(id) {
    const { data, error } = await supabase
      .from('cuentos')
      .select(`
        id_cuento, cuenta_usuario_id, titulo, descripcion, portada_url, estado, visibilidad, vistas,
        cuenta_usuario ( username, avatar_url ), categorias ( nombre ),
        capitulos ( id_capitulo, titulo, created_at, contenido )
      `)
      .eq('id_cuento', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') return null; // No encontrada
      throw error;
    }
    
    if (data && data.capitulos) {
      data.capitulos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }
    return data;
  },

  // Búsqueda avanzada
  async searchHistorias(q, page = 1, limit = 20, filters = {}) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    let userIds = [];
    if (q) {
      // Buscar IDs de usuarios que coincidan con la búsqueda
      const { data: users } = await supabase
        .from('cuenta_usuario')
        .select('id_cuenta_usuario')
        .ilike('username', `%${q}%`);
      if (users && users.length > 0) {
        userIds = users.map(u => u.id_cuenta_usuario);
      }
    } else if (filters.autor) {
      // Si se especificó el filtro exacto por autor
      const { data: user } = await supabase
        .from('cuenta_usuario')
        .select('id_cuenta_usuario')
        .eq('username', filters.autor)
        .single();
      if (user) userIds = [user.id_cuenta_usuario];
      else return { resultados: [], count: 0, totalPages: 0 };
    }

    let query = supabase
      .from('cuentos')
      .select(`
        *,
        cuenta_usuario ( id_cuenta_usuario, username, avatar_url ),
        categorias ( nombre )
      `, { count: 'exact' })
      .eq('estado', 'publicado')
      .eq('visibilidad', 'publica');

    // Construir consulta OR para titulo, descripcion o ID de usuario
    if (q) {
      if (userIds.length > 0) {
        query = query.or(`titulo.ilike.%${q}%,descripcion.ilike.%${q}%,cuenta_usuario_id.in.(${userIds.join(',')})`);
      } else {
        query = query.or(`titulo.ilike.%${q}%,descripcion.ilike.%${q}%`);
      }
    } else if (filters.autor && userIds.length > 0) {
       query = query.eq('cuenta_usuario_id', userIds[0]);
    }

    if (filters.categoria_id) query = query.eq('categoria_id', filters.categoria_id);
    if (filters.audiencia) query = query.eq('audiencia', filters.audiencia);

    const sortColumn = filters.sort === 'vistas' ? 'vistas' : 'created_at';
    const { data, count, error } = await query
      .order(sortColumn, { ascending: false })
      .range(start, end);

    if (error) throw error;
    return { resultados: data, count, totalPages: Math.ceil((count || 0) / limit) };
  },

  async incrementViews(id) {
    // Leemos el valor actual y le sumamos 1 (simplificado para NodeJS)
    const { data: cuento } = await supabase
      .from('cuentos')
      .select('vistas')
      .eq('id_cuento', id)
      .single();
    
    if (cuento) {
      await supabase
        .from('cuentos')
        .update({ vistas: (cuento.vistas || 0) + 1 })
        .eq('id_cuento', id);
    }
  },

  async getMyStories(userId) {
    const { data, error } = await supabase
      .from('cuentos')
      .select(`
        id_cuento, titulo, descripcion, portada_url, estado, vistas, created_at
      `)
      .eq('cuenta_usuario_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createStory(data) {
    const { error, data: inserted } = await supabase
      .from('cuentos')
      .insert([data])
      .select();
    if (error) throw error;
    return inserted[0];
  },

  async updateStory(id, updates) {
    const { error } = await supabase
      .from('cuentos')
      .update(updates)
      .eq('id_cuento', id);
    if (error) throw error;
    return true;
  },

  async deleteStory(id) {
    // Delete chapters first to avoid FK violation
    await supabase.from('capitulos').delete().eq('cuento_id', id);
    const { error } = await supabase
      .from('cuentos')
      .delete()
      .eq('id_cuento', id);
    if (error) throw error;
    return true;
  },

  async getDashboardTotal() {
    const { count, error } = await supabase
      .from('cuentos')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count;
  }
};

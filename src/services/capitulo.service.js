import { supabaseAdmin as supabase } from '../config/db.js';

export const capituloService = {
  async getCapitulosPaginated(page = 1, limit = 20) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, count, error } = await supabase
      .from('capitulos')
      .select('id_capitulo, titulo, cuento_id, created_at, cuentos(titulo)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error) throw error;
    return { capitulos: data, count, totalPages: Math.ceil((count || 0) / limit) };
  },

  async createCapitulo(data) {
    const { error } = await supabase
      .from('capitulos')
      .insert([data]);
    if (error) throw error;
    return true;
  },

  async updateCapitulo(id, updates) {
    const { error } = await supabase
      .from('capitulos')
      .update(updates)
      .eq('id_capitulo', id);
    if (error) throw error;
    return true;
  },

  async deleteCapitulo(id) {
    const { error } = await supabase
      .from('capitulos')
      .delete()
      .eq('id_capitulo', id);
    if (error) throw error;
    return true;
  },

  async getDashboardTotal() {
    const { count, error } = await supabase
      .from('capitulos')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count;
  }
};

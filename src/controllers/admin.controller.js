// src/controllers/admin.controller.js
import { supabaseAdmin as supabase } from '../config/db.js';

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────

export const getDashboard = async (req, res) => {
  try {
    const [
      { count: totalUsuarios },
      { count: totalHistorias },
      { count: totalCategorias },
      { count: totalCapitulos }
    ] = await Promise.all([
      supabase.from('cuenta_usuario').select('*', { count: 'exact', head: true }),
      supabase.from('cuentos').select('*', { count: 'exact', head: true }),
      supabase.from('categorias').select('*', { count: 'exact', head: true }),
      supabase.from('capitulos').select('*', { count: 'exact', head: true })
    ]);

    res.render('admin', {
      loggerUser: req.session.user,
      seccion: 'dashboard',
      stats: { totalUsuarios, totalHistorias, totalCategorias, totalCapitulos },
      usuarios: [],
      historias: [],
      categorias: [],
      mensaje: req.query.msg || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error('Error dashboard admin:', err);
    res.status(500).send('Error al cargar el panel');
  }
};

// ─────────────────────────────────────────────
// USUARIOS — CRUD
// ─────────────────────────────────────────────

export const getUsuarios = async (req, res) => {
  try {
    const { data: usuarios, error } = await supabase
      .from('cuenta_usuario')
      .select('id_cuenta_usuario, username, email, rol, estado, fecha_registro')
      .order('fecha_registro', { ascending: false });

    if (error) throw error;

    res.render('admin', {
      loggerUser: req.session.user,
      seccion: 'usuarios',
      stats: {},
      usuarios: usuarios || [],
      historias: [],
      categorias: [],
      mensaje: req.query.msg || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error('Error listar usuarios:', err);
    res.redirect('/admin?error=Error+al+cargar+usuarios');
  }
};

export const editUsuario = async (req, res) => {
  const { id } = req.params;
  const { rol, estado } = req.body;
  try {
    const { error } = await supabase
      .from('cuenta_usuario')
      .update({ rol, estado })
      .eq('id_cuenta_usuario', id);

    if (error) throw error;
    res.redirect('/admin/usuarios?msg=Usuario+actualizado');
  } catch (err) {
    console.error('Error editar usuario:', err);
    res.redirect('/admin/usuarios?error=Error+al+actualizar');
  }
};

export const deleteUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('cuenta_usuario')
      .delete()
      .eq('id_cuenta_usuario', id);

    if (error) throw error;
    res.redirect('/admin/usuarios?msg=Usuario+eliminado');
  } catch (err) {
    console.error('Error eliminar usuario:', err);
    res.redirect('/admin/usuarios?error=Error+al+eliminar');
  }
};

// ─────────────────────────────────────────────
// HISTORIAS (CUENTOS) — CRUD
// ─────────────────────────────────────────────

export const getHistorias = async (req, res) => {
  try {
    const { data: historias, error } = await supabase
      .from('cuentos')
      .select(`
        id_cuento,
        titulo,
        estado,
        visibilidad,
        vistas,
        created_at,
        cuenta_usuario ( username )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.render('admin', {
      loggerUser: req.session.user,
      seccion: 'historias',
      stats: {},
      usuarios: [],
      historias: historias || [],
      categorias: [],
      mensaje: req.query.msg || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error('Error listar historias:', err);
    res.redirect('/admin?error=Error+al+cargar+historias');
  }
};

export const editHistoria = async (req, res) => {
  const { id } = req.params;
  const { estado, visibilidad } = req.body;
  try {
    const { error } = await supabase
      .from('cuentos')
      .update({ estado, visibilidad })
      .eq('id_cuento', id);

    if (error) throw error;
    res.redirect('/admin/historias?msg=Historia+actualizada');
  } catch (err) {
    console.error('Error editar historia:', err);
    res.redirect('/admin/historias?error=Error+al+actualizar');
  }
};

export const deleteHistoria = async (req, res) => {
  const { id } = req.params;
  try {
    // Eliminar capítulos primero para respetar FK
    await supabase.from('capitulos').delete().eq('cuento_id', id);

    const { error } = await supabase
      .from('cuentos')
      .delete()
      .eq('id_cuento', id);

    if (error) throw error;
    res.redirect('/admin/historias?msg=Historia+eliminada');
  } catch (err) {
    console.error('Error eliminar historia:', err);
    res.redirect('/admin/historias?error=Error+al+eliminar');
  }
};

// ─────────────────────────────────────────────
// CATEGORÍAS — CRUD
// ─────────────────────────────────────────────

export const getCategorias = async (req, res) => {
  try {
    const { data: categorias, error } = await supabase
      .from('categorias')
      .select('id_categoria, nombre')
      .order('nombre', { ascending: true });

    if (error) throw error;

    res.render('admin', {
      loggerUser: req.session.user,
      seccion: 'categorias',
      stats: {},
      usuarios: [],
      historias: [],
      categorias: categorias || [],
      mensaje: req.query.msg || null,
      error: req.query.error || null
    });
  } catch (err) {
    console.error('Error listar categorias:', err);
    res.redirect('/admin?error=Error+al+cargar+categorias');
  }
};

export const createCategoria = async (req, res) => {
  const { nombre } = req.body;
  if (!nombre || !nombre.trim()) {
    return res.redirect('/admin/categorias?error=El+nombre+es+requerido');
  }
  try {
    const { error } = await supabase
      .from('categorias')
      .insert([{ nombre: nombre.trim() }]);

    if (error) throw error;
    res.redirect('/admin/categorias?msg=Categoria+creada');
  } catch (err) {
    console.error('Error crear categoria:', err);
    res.redirect('/admin/categorias?error=Error+al+crear');
  }
};

export const editCategoria = async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  try {
    const { error } = await supabase
      .from('categorias')
      .update({ nombre: nombre.trim() })
      .eq('id_categoria', id);

    if (error) throw error;
    res.redirect('/admin/categorias?msg=Categoria+actualizada');
  } catch (err) {
    console.error('Error editar categoria:', err);
    res.redirect('/admin/categorias?error=Error+al+actualizar');
  }
};

export const deleteCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id_categoria', id);

    if (error) throw error;
    res.redirect('/admin/categorias?msg=Categoria+eliminada');
  } catch (err) {
    console.error('Error eliminar categoria:', err);
    res.redirect('/admin/categorias?error=Error+al+eliminar');
  }
};

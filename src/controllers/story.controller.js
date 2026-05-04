// controllers/story.controller.js
import { supabaseAdmin as supabase } from '../config/db.js'

// GET /api/cuentos — traer todos los cuentos públicos y publicados
export const getStories = async (req, res) => {
  const { data, error } = await supabase
    .from('cuentos')
    .select(`
      id_cuento,
      titulo,
      descripcion,
      portada_url,
      estado,
      audiencia,
      created_at,
      cuenta_usuario ( username, avatar_url ),
      categorias ( nombre )
    `)
    .eq('estado', 'publicado')
    .eq('visibilidad', 'publica')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// GET /api/cuentos/:id — traer un cuento con sus capítulos
export const getStoryById = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('cuentos')
    .select(`
      id_cuento,
      titulo,
      descripcion,
      portada_url,
      estado,
      vistas,
      cuenta_usuario ( username, avatar_url ),
      categorias ( nombre ),
      capitulos ( id_capitulo, titulo, created_at )
    `)
    .eq('id_cuento', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') { // Error code for 'The result contains 0 rows'
      return res.status(404).render('404', { message: "Cuento no encontrado" });
    }
    return res.status(500).json({ error: error.message })
  }

  // --- VALIDACIÓN DE PRIVACIDAD ---
  const isAuthor = req.session && req.session.user && (String(data.cuenta_usuario_id) === String(req.session.user.id));
  const isPublic = data.estado === 'publicado' && data.visibilidad === 'publica';

  if (!isPublic && !isAuthor) {
    return res.status(403).render('404', {
      message: "Esta historia es privada o se encuentra en estado de borrador.",
      loggerUser: req.session.user
    });
  }
  // --------------------------------

  // Sort chapters by date (if not already sorted by DB)
  if (data.capitulos) {
    data.capitulos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  res.render('story', {
    cuento: data,
    user: req.session.user, // user del contexto de la historia
    loggerUser: req.session.user // usuario logueado para el navbar
  })
}

// GET /api/cuentos/category/:id — cuentos por categoría
export const getStoriesByCategory = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('cuentos')
    .select(`
      id_cuento,
      titulo,
      descripcion,
      portada_url,
      cuenta_usuario ( username ),
      categorias ( nombre )
    `)
    .eq('categoria_id', id)
    .eq('estado', 'publicado')
    .eq('visibilidad', 'publica')

  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
}

// POST /api/cuentos/new — crear un cuento
export const createStory = async (req, res) => {
  try {
    const {
      titulo,
      descripcion,
      audiencia,
      idioma,
      derechos,
      clasificacion,
      categoria_id, // Ensure this comes from form
      visibilidad
    } = req.body

    // Validate user session
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
    console.log("=== SESSION DEBUG ===", JSON.stringify(req.session, null, 2));
    const cuenta_usuario_id = req.session.userId || req.session.user.id_cuenta_usuario || req.session.user.id;

    let portada_url = null;

    // Handle file upload
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portadas')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('portadas')
        .getPublicUrl(filePath);

      portada_url = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('cuentos')
      .insert([{
        titulo,
        descripcion,
        portada_url,
        audiencia: audiencia || 'general',
        idioma,
        derechos: derechos || 'todos',
        clasificacion,
        categoria_id: parseInt(categoria_id) || 1,
        cuenta_usuario_id,
        estado: req.body.estado || 'borrador', // Por defecto borrador
        visibilidad: visibilidad || 'publica' // Por defecto publica
      }])
      .select()

    if (error) throw error;

    // Redirige al formulario de edición (metadatos/portada)
    const newStory = data[0];
    res.redirect(`/historias/editar-meta/${newStory.id_cuento}`);

  } catch (error) {
    console.error("Error creating story:", error);
    res.status(500).render('newstorys', {
      loggerUser: req.session.user,
      error: "Error al crear la historia: " + error.message
    });
  }
}

// GET /historias/mis — Ver mis historias (propias)
export const getMyStories = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    const userId = req.session.user.id;

    const { data: stories, error } = await supabase
      .from('cuentos')
      .select(`
        id_cuento,
        titulo,
        descripcion,
        portada_url,
        estado,
        vistas,
        created_at
      `)
      .eq('cuenta_usuario_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.render('mystories', {
      tituloPagina: 'Mis Historias | Willpig Studio',
      stories: stories || [],
      loggerUser: req.session.user
    });

  } catch (error) {
    console.error('Error al obtener mis historias:', error);
    res.status(500).send("Error al cargar tus historias");
  }
}

// GET /historias/editar/:id — Gestionar una historia (Panel del Autor)
export const getEditStory = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    const { data: cuento, error } = await supabase
      .from('cuentos')
      .select(`
        id_cuento,
        titulo,
        descripcion,
        portada_url,
        estado,
        visibilidad,
        cuenta_usuario_id,
        capitulos ( id_capitulo, titulo, created_at )
      `)
      .eq('id_cuento', id)
      .single();

    if (error || !cuento) {
      return res.status(404).render('404', { message: "Historia no encontrada" });
    }

    // Verificar autoría
    const userId = req.session.userId || req.session.user.id_cuenta_usuario || req.session.user.id;
    if (String(cuento.cuenta_usuario_id) !== String(userId)) {
      return res.status(403).render('404', { message: "No tienes permiso para editar esta historia" });
    }

    // Ordenar capítulos
    if (cuento.capitulos) {
      cuento.capitulos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    res.render('manage_story', {
      cuento,
      loggerUser: req.session.user
    });

  } catch (error) {
    console.error('Error al obtener gestión de historia:', error);
    res.status(500).send("Error del servidor");
  }
}

// GET /historias/editar-meta/:id — Formulario de edición (Metadatos)
export const getEditMetadata = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    const { data: cuento, error } = await supabase
      .from('cuentos')
      .select(`
        id_cuento,
        titulo,
        descripcion,
        portada_url,
        estado,
        visibilidad,
        audiencia,
        idioma,
        derechos,
        clasificacion,
        categoria_id,
        cuenta_usuario_id
      `)
      .eq('id_cuento', id)
      .single();

    if (error || !cuento) {
      return res.status(404).render('404', { message: "Historia no encontrada" });
    }

    // Verificar autoría
    const userId = req.session.userId || req.session.user.id_cuenta_usuario || req.session.user.id;
    if (String(cuento.cuenta_usuario_id) !== String(userId)) {
      return res.status(403).render('404', { message: "No tienes permiso para editar esta historia" });
    }

    res.render('editstory', {
      cuento,
      loggerUser: req.session.user
    });

  } catch (error) {
    console.error('Error al obtener formulario de edición:', error);
    res.status(500).send("Error del servidor");
  }
}

// GET /historias/editar/:id/capitulos/nuevo — Crear nuevo capítulo
export const getNewChapter = async (req, res) => {
  const { id } = req.params;

  try {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    // Verificar que el usuario sea el dueño de la historia
    const { data: cuento, error: storyError } = await supabase
      .from('cuentos')
      .select('cuenta_usuario_id')
      .eq('id_cuento', id)
      .single();

    if (storyError || !cuento) {
      return res.status(404).render('404', { message: "Historia no encontrada" });
    }

    const userId = req.session.userId || req.session.user.id_cuenta_usuario || req.session.user.id;
    if (String(cuento.cuenta_usuario_id) !== String(userId)) {
      return res.status(403).render('404', { message: "No tienes permiso para crear capítulos en esta historia" });
    }

    res.render('chapter_editor', {
      loggerUser: req.session.user,
      storyId: id,
      chapter: null // null indica que es nuevo
    });

  } catch (error) {
    console.error('Error al obtener editor de capítulo:', error);
    res.status(500).send("Error del servidor");
  }
}

// POST /historias/editar/:id — Actualizar una historia
export const editStory = async (req, res) => {
  const { id } = req.params;
  const {
    titulo,
    descripcion,
    audiencia,
    idioma,
    derechos,
    clasificacion,
    categoria_id,
    visibilidad,
    estado
  } = req.body;

  try {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    // Identificar usuario
    const userId = req.session.userId || req.session.user.id_cuenta_usuario || req.session.user.id;

    // Verificar autoría antes de actualizar
    const { data: cuento, error: fetchError } = await supabase
      .from('cuentos')
      .select('cuenta_usuario_id, portada_url')
      .eq('id_cuento', id)
      .single();

    if (fetchError || !cuento) {
      return res.status(404).render('404', { message: "Historia no encontrada" });
    }

    if (String(cuento.cuenta_usuario_id) !== String(userId)) {
      return res.status(403).render('404', { message: "No tienes permiso para editar esta historia" });
    }

    let portada_url = cuento.portada_url;

    // Manejar nueva portada si existe
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portadas')
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('portadas')
        .getPublicUrl(filePath);

      portada_url = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('cuentos')
      .update({
        titulo,
        descripcion,
        portada_url,
        audiencia: audiencia || 'general',
        idioma,
        derechos: derechos || 'todos',
        clasificacion,
        categoria_id: parseInt(categoria_id) || 1,
        visibilidad: visibilidad || 'publica',
        estado: estado || 'borrador'
      })
      .eq('id_cuento', id);

    if (updateError) throw updateError;

    res.redirect(`/historias/editar/${id}`);

  } catch (error) {
    console.error('Error al actualizar la historia:', error);
    res.status(500).send("Error al actualizar la historia");
  }
};

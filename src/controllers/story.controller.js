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

  // Sort chapters by date (if not already sorted by DB)
  if (data.capitulos) {
    data.capitulos.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  res.render('story', {
    cuento: data,
    user: req.session.user // Pass null or user if managed globally
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

    // redirige a la pantalla principal
    res.redirect('/principal');

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

// GET /historias/edit/:id — Cargar formulario de edición
export const getEditStory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    const { data: story, error } = await supabase
      .from('cuentos')
      .select('*')
      .eq('id_cuento', id)
      .single();

    if (error || !story) {
      return res.status(404).render('404', { message: "Historia no encontrada" });
    }

    // Verificar que el usuario sea el dueño
    const userId = req.session.user.id;
    if (story.cuenta_usuario_id !== userId) {
      return res.status(403).send("No tienes permiso para editar esta historia");
    }

    res.render('editstory', {
      loggerUser: req.session.user,
      cuento: story
    });

  } catch (error) {
    console.error('Error al obtener historia para editar:', error);
    res.status(500).send("Error interno del servidor");
  }
}

// POST /historias/edit/:id — Procesar la edición
export const editStory = async (req, res) => {
  try {
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

    if (!req.session.user) {
      return res.redirect('/auth/login');
    }

    // Primero verificar propiedad
    const { data: existingStory, error: fetchError } = await supabase
      .from('cuentos')
      .select('cuenta_usuario_id, portada_url')
      .eq('id_cuento', id)
      .single();

    if (fetchError || !existingStory) {
      return res.status(404).send("Historia no encontrada");
    }

    if (existingStory.cuenta_usuario_id !== req.session.user.id) {
      return res.status(403).send("No tienes permiso para editar esta historia");
    }

    let portada_url = existingStory.portada_url;

    // Manejar nueva portada si se subió una
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

    const { error: updateError } = await supabase
      .from('cuentos')
      .update({
        titulo,
        descripcion,
        portada_url,
        audiencia,
        idioma,
        derechos,
        clasificacion,
        categoria_id: parseInt(categoria_id),
        visibilidad,
        estado
      })
      .eq('id_cuento', id);

    if (updateError) throw updateError;

    res.redirect('/historias/mis');

  } catch (error) {
    console.error("Error editing story:", error);
    res.status(500).send("Error al editar la historia");
  }
}
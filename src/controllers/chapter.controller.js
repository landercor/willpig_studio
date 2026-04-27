import { supabaseAdmin as supabase } from "../config/db.js";

// Crear capítulo
export const createChapter = async (req, res) => {
  const { titulo, contenido, cuento_id } = req.body;

  try {
    const { data, error } = await supabase
      .from('capitulos')
      .insert([
        { titulo, contenido, cuento_id }
      ])
      .select();

    if (error) throw error;

    // Redirigir de vuelta al editor para ver el nuevo capítulo y seguir editando
    res.redirect(`/historias/editar/${cuento_id}`);

  } catch (error) {
    console.error("Error creating chapter:", error);
    res.status(500).send("Error al crear capítulo");
  }
};

// Obtener capítulos por cuento
export const getChapters = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: rows, error } = await supabase
      .from('capitulos')
      .select('*')
      .eq('cuento_id', id)
      .order('created_at', { ascending: true }); // Assuming created_at replaces fecha_creado

    if (error) throw error;

    res.json(rows);
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({ error: "Error al obtener capítulos" });
  }
};

// Leer capitulo (frontend)
export const readChapter = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Fetch current chapter with Story info
    const { data: capitulo, error: capError } = await supabase
      .from('capitulos')
      .select(`
        *,
        cuentos ( titulo, id_cuento, cuenta_usuario_id )
      `)
      .eq('id_capitulo', id)
      .single();

    if (capError || !capitulo) {
      return res.status(404).render('404', { message: "Capítulo no encontrado" });
    }

    // 2. Fetch all chapters of this story to determine Nav
    const { data: allChapters, error: listError } = await supabase
      .from('capitulos')
      .select('id_capitulo')
      .eq('cuento_id', capitulo.cuento_id)
      .order('created_at', { ascending: true }); // Ensure order matches reading order

    let prevId = null;
    let nextId = null;

    if (allChapters) {
      const currentIndex = allChapters.findIndex(c => c.id_capitulo == id);
      if (currentIndex > 0) prevId = allChapters[currentIndex - 1].id_capitulo;
      if (currentIndex < allChapters.length - 1) nextId = allChapters[currentIndex + 1].id_capitulo;
    }

    res.render('read', {
      capitulo,
      cuento: capitulo.cuentos,
      prevId,
      nextId
    });

  } catch (error) {
    console.error("Error reading chapter:", error);
    res.status(500).send("Error del servidor");
  }
};

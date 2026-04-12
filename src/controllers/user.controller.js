// src/controllers/user.controller.js
import { supabaseAdmin as supabase } from "../config/db.js";
import bcrypt from "bcrypt";

// --- API Endpoints (JSON) ---

export const apiRegister = async (req, res) => {
  const { username, email, clave } = req.body;
  try {
    const hashedPass = await bcrypt.hash(clave, 10);
    const { data, error } = await supabase
      .from('cuenta_usuario')
      .insert([{ username, email, clave: hashedPass }])
      .select();

    if (error) throw error;
    const newUser = data[0];
    res.status(201).json({ message: "Usuario registrado", id: newUser.id_cuenta_usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const apiLogin = async (req, res) => {
  const { email, clave } = req.body;
  try {
    const { data: rows, error } = await supabase
      .from('cuenta_usuario')
      .select('*')
      .eq('email', email);

    if (error) throw error;
    if (rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

    const user = rows[0];
    const valid = await bcrypt.compare(clave, user.clave);
    if (!valid) return res.status(401).json({ error: "Clave incorrecta" });

    req.session.user = {
      id: user.id_cuenta_usuario,
      username: user.username,
      email: user.email,
      rol: user.rol,
      avatar: user.avatar_url
    };

    res.json({ message: "Inicio de sesión exitoso", user: req.session.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// --- Perfil de Usuario ---

export const getProfile = async (req, res) => {
  const { id } = req.params;
  try {
    console.log("Fetching profile for ID:", id);

    // 1. Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
      .from('cuenta_usuario')
      .select('username, email, biografia, avatar_url, rol')
      .eq('id_cuenta_usuario', id)
      .single();

    console.log("Supabase response:", { userData, userError });

    if (userError || !userData) {
      console.error("Profile not found error:", userError);
      return res.status(404).render('404', { message: "Usuario no encontrado" });
    }

    // 2. Obtener obras creadas por el usuario
    // Si el usuario logueado es el dueño del perfil, mostrar todo. Si no, solo lo publicado.
    const isOwner = req.session && req.session.user && (String(req.session.user.id) === String(id));
    
    let query = supabase
      .from('cuentos')
      .select('id_cuento, titulo, portada_url, vistas, estado')
      .eq('cuenta_usuario_id', id);

    if (!isOwner) {
      query = query.eq('estado', 'publicado');
    }

    const { data: userWorks } = await query;

    // Mapear los datos al formato que espera profile.ejs
    const userProfile = {
      _id: id,
      name: userData.username,
      username: userData.username,
      avatar: userData.avatar_url,
      coverImage: '/img/default-cover.jpg',
      joined: 'Recientemente',
      works: userWorks || [],
      readingLists: [], // Pendiente de implementar listas de lectura en BD
      followers: [],    // Pendiente de implementar seguidores en BD
      following: []
    };

    res.render('profile', {
      profile: { title: `Perfil de ${userData.username}` },
      user: userProfile,
      loggedUser: req.session.user || { _id: 'guest' }, // Manejar visitante no logueado
      loggerUser: req.session.user
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).send("Error al obtener perfil");
  }
};

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { username, biografia, avatar_url } = req.body;
  try {
    const { error } = await supabase
      .from('cuenta_usuario')
      .update({ username, biografia, avatar_url })
      .eq('id_cuenta_usuario', id);

    if (error) throw error;
    res.json({ message: "Perfil actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
}; 0
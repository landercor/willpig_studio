<<<<<<< HEAD
=======
// src/controllers/user.controller.js
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
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

<<<<<<< HEAD
    const { data, error } = await supabase
      .from('cuenta_usuario')
      .insert([
        { username, email, clave: hashedPass }
      ])
      .select();

    if (error) throw error;

    const newUser = data[0];

    // Set session
    req.session.user = {
      id: newUser.id_cuenta_usuario,
      username: newUser.username,
      email: newUser.email,
      rol: newUser.rol,
      avatar: newUser.avatar_url
    };

=======
    if (error) throw error;
    const newUser = data[0];
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
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
<<<<<<< HEAD

    if (error) throw error;
=======
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8

    if (error) throw error;
    if (rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

    const user = rows[0];
    const valid = await bcrypt.compare(clave, user.clave);
    if (!valid) return res.status(401).json({ error: "Clave incorrecta" });

<<<<<<< HEAD
    const userData = {
=======
    req.session.user = {
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
      id: user.id_cuenta_usuario,
      username: user.username,
      email: user.email,
      rol: user.rol,
      avatar: user.avatar_url
    };
<<<<<<< HEAD

    // Set session
    req.session.user = userData;

    res.json({
      message: "Inicio de sesión exitoso",
      user: userData
    });
=======
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8

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
<<<<<<< HEAD
    const { data: rows, error } = await supabase
      .from('cuenta_usuario')
      .select('username, email, biografia, avatar_url, rol')
      .eq('id_cuenta_usuario', id);

    if (error) throw error;
=======
    console.log("Fetching profile for ID:", id);
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8

    // 1. Obtener datos del usuario (Sin created_at porque la tabla no lo tiene)
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

    // 2. Obtener obras creadas por el usuario (publicadas)
    const { data: userWorks } = await supabase
      .from('cuentos')
      .select('id_cuento, titulo, portada_url, vistas')
      .eq('cuenta_usuario_id', id)
      .eq('estado', 'publicado');

    // Mapear los datos al formato que espera profile.ejs
    const userProfile = {
      _id: id,
      name: userData.username, // Suponiendo que usas username como nombre a mostrar
      username: userData.username,
      avatar: userData.avatar_url,
      coverImage: '/img/default-cover.jpg', // No hay coverImage en DB aún
      joined: 'Recientemente', // Fallback, ya que no existe created_at en la DB
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
<<<<<<< HEAD

    if (error) throw error;
=======
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8

    if (error) throw error;
    res.json({ message: "Perfil actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar perfil" });
  }
};
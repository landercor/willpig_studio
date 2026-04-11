import { supabaseAdmin as supabase } from "../config/db.js";
import bcrypt from "bcrypt";

// Registro
export const registerUser = async (req, res) => {
  const { username, email, clave } = req.body;

  try {
    const hashedPass = await bcrypt.hash(clave, 10);

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

    res.status(201).json({ message: "Usuario registrado", id: newUser.id_cuenta_usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { email, clave } = req.body;

  try {
    const { data: rows, error } = await supabase
      .from('cuenta_usuario')
      .select('*')
      .eq('email', email);

    if (error) throw error;

    if (rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(clave, user.clave);

    if (!valid) return res.status(401).json({ error: "Clave incorrecta" });

    const userData = {
      id: user.id_cuenta_usuario,
      username: user.username,
      email: user.email,
      rol: user.rol,
      avatar: user.avatar_url
    };

    // Set session
    req.session.user = userData;

    res.json({
      message: "Inicio de sesión exitoso",
      user: userData
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};

// Obtener perfil
export const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: rows, error } = await supabase
      .from('cuenta_usuario')
      .select('username, email, biografia, avatar_url, rol')
      .eq('id_cuenta_usuario', id);

    if (error) throw error;

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener perfil" });
  }
};
// Actualizar perfil
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
};
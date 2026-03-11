// src/controllers/auth.controller.js
import { supabaseAdmin as supabase } from "../config/db.js";
import bcrypt from "bcrypt";

// --- Vistas de Autenticación (EJS) ---

export const register = async (req, res) => {
  try {
    const { username, correo, contrasena } = req.body;
    console.log("Registering user:", { username, correo });

    if (!username || !correo || !contrasena) {
      return res.render("register", { error: "Todos los campos son obligatorios." });
    }

    // verificar email duplicado
    const { data: existingUser, error: searchError } = await supabase
      .from('cuenta_usuario')
      .select('email')
      .eq('email', correo)
      .maybeSingle();

    if (searchError) {
      console.error("Error checking existing user:", searchError);
      return res.render("register", { error: "Error verificando usuario." });
    }

    if (existingUser) {
      console.log("User already exists:", correo);
      return res.render("register", { error: "Ya existe una cuenta con este correo." });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    const { data: newUser, error: insertError } = await supabase
      .from('cuenta_usuario')
      .insert([
        {
          username,
          email: correo,
          clave: hash,
          rol: 'lector', // rol por defecto
          estado: 'activa' // estado por defecto
        }
      ])
      .select();

    if (insertError) {
      console.error("Error inserting user:", insertError);
      throw insertError;
    }

    console.log("User registered successfully:", newUser);
    return res.redirect("/auth/login");
  } catch (err) {
    console.error("Error in register:", err);
    return res.render("register", { error: "Hubo un error en el registro: " + err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;
    console.log("Logging in user:", correo);

    if (!correo || !contrasena) {
      return res.render("login", { error: "Completa los campos." });
    }

    const { data: user, error } = await supabase
      .from('cuenta_usuario')
      .select('*')
      .eq('email', correo)
      .single();

    if (error || !user) {
      console.error("Supabase login error (or user not found):", error);
      return res.render("login", { error: "Usuario o contraseña incorrectos." });
    }

    const ok = await bcrypt.compare(contrasena, user.clave);
    if (!ok) {
      console.log("Password mismatch for:", correo);
      return res.render("login", { error: "Usuario o contraseña incorrectos." });
    }

    // establecer sesion
    req.session.userId = user.id_cuenta_usuario;
    req.session.user = {
      id: user.id_cuenta_usuario,
      username: user.username,
      email: user.email,
      rol: user.rol,
      avatar: user.avatar_url
    };
    console.log("Login successful, session set for:", user.username);

    return res.redirect("/principal");
  } catch (err) {
    console.error("Error in login:", err);
    return res.render("login", { error: "Error al iniciar sesión: " + err.message });
  }
};

// --- Recuperación de Contraseña ---

export const forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) {
      return res.render("olvido", { error: "Introduce un correo válido." });
    }

    const { data: user, error } = await supabase
      .from('cuenta_usuario')
      .select('*')
      .eq('email', correo)
      .single();

    if (error || !user) {
      console.log("Email not found for recovery:", correo);
      return res.render("olvido", { error: "No existe una cuenta con ese correo." });
    }

    // Guardar correo en sesión para el siguiente paso
    req.session.resetEmail = correo;

    return res.redirect("/auth/nuevaclave");
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return res.render("olvido", { error: "Ocurrió un error: " + err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { nuevaClave, confirmarClave } = req.body;
    const email = req.session.resetEmail;

    if (!email) {
      return res.render("nuevaclave", { error: "Sesión expirada. Por favor intenta el proceso de recuperación nuevamente." });
    }

    if (!nuevaClave || !confirmarClave) {
      return res.render("nuevaclave", { error: "Completa ambos campos de contraseña." });
    }

    if (nuevaClave !== confirmarClave) {
      return res.render("nuevaclave", { error: "Las contraseñas no coinciden." });
    }

    // validar complejidad: al menos una mayúscula, una minúscula y un número
    const complexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if (!complexity.test(nuevaClave)) {
      return res.render("nuevaclave", { error: "La contraseña debe contener mayúscula, minúscula y un número." });
    }

    const hash = await bcrypt.hash(nuevaClave, 10);
    const { error } = await supabase
      .from('cuenta_usuario')
      .update({ clave: hash })
      .eq('email', email);

    if (error) {
      console.error("Error updating password:", error);
      return res.render("nuevaclave", { error: "Error al actualizar la contraseña." });
    }

    req.session.resetEmail = null;
    return res.redirect("/auth/login");
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.render("nuevaclave", { error: "Ocurrió un error: " + err.message });
  }
};

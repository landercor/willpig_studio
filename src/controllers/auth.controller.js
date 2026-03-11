// src/controllers/auth.controller.js
import { supabase, supabaseAdmin } from "../config/db.js";
import bcrypt from "bcrypt";

// --- Vistas de Autenticación (EJS) ---

export const register = async (req, res) => {
  try {
    const { username, correo, contrasena } = req.body;
    console.log("Registering user:", { username, correo });

    if (!username || !correo || !contrasena) {
      return res.render("register", { error: "Todos los campos son obligatorios." });
    }

    // 1. Registrar en Supabase Auth (Para permitir recuperación de contraseña nativa)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: correo,
      password: contrasena,
      options: {
        data: { username }
      }
    });

    if (authError) {
      console.error("Supabase Auth Error:", authError);
      return res.render("register", { error: "Error en el servicio de autenticación: " + authError.message });
    }

    // 2. Registrar en nuestra tabla personalizada 'cuenta_usuario'
    const hash = await bcrypt.hash(contrasena, 10);
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('cuenta_usuario')
      .insert([
        {
          username,
          email: correo,
          clave: hash,
          rol: 'lector',
          estado: 'activa'
        }
      ])
      .select();

    if (insertError) {
      console.error("Error inserting user in DB:", insertError);
      // Opcional: Podríamos borrar el usuario de Auth si falla la DB, pero Supabase Auth no es fácil de "limpiar" por seguridad.
      return res.render("register", { error: "Error al guardar el perfil del usuario." });
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
    if (!correo || !contrasena) {
      return res.render("login", { error: "Completa los campos." });
    }

    const { data: user, error } = await supabaseAdmin
      .from('cuenta_usuario')
      .select('*')
      .eq('email', correo)
      .single();

    if (error || !user) {
      return res.render("login", { error: "Usuario o contraseña incorrectos." });
    }

    const ok = await bcrypt.compare(contrasena, user.clave);
    if (!ok) {
      return res.render("login", { error: "Usuario o contraseña incorrectos." });
    }

    // Establecer sesión personalizada
    req.session.userId = user.id_cuenta_usuario;
    req.session.user = {
      id: user.id_cuenta_usuario,
      username: user.username,
      email: user.email,
      rol: user.rol,
      avatar: user.avatar_url
    };

    return res.redirect("/principal");
  } catch (err) {
    console.error("Error in login:", err);
    return res.render("login", { error: "Error al iniciar sesión: " + err.message });
  }
};

// --- Recuperación de Contraseña con Supabase Auth ---

export const forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) {
      return res.render("olvido", { error: "Introduce un correo válido." });
    }

    // Usar el servicio de Supabase para enviar correo de recuperación
    const { error } = await supabase.auth.resetPasswordForEmail(correo, {
      redirectTo: `${req.protocol}://${req.get('host')}/auth/callback`,
    });

    if (error) {
      console.error("Error enviando correo de recuperación:", error.message);
      return res.render("olvido", { error: "No pudimos enviar el correo: " + error.message });
    }

    // Éxito: Informamos al usuario
    return res.render("olvido", { 
      error: "Te hemos enviado un correo. Por favor, revisa tu bandeja de entrada." 
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return res.render("olvido", { error: "Ocurrió un error inesperado." });
  }
};

// Callback para procesar el token de recuperación
export const authCallback = async (req, res) => {
  // Supabase maneja los tokens en el hash de la URL (#), pero en el servidor 
  // solo podemos ver los query params si los habilitamos.
  // Sin embargo, para este flujo, redirigiremos directamente a nuevaclave 
  // confiando en que Supabase establecerá la sesión si el enlace es válido.
  return res.redirect("/auth/nuevaclave");
};

export const resetPassword = async (req, res) => {
  try {
    const { nuevaClave, confirmarClave } = req.body;

    if (!nuevaClave || !confirmarClave) {
      return res.render("nuevaclave", { error: "Completa ambos campos." });
    }

    if (nuevaClave !== confirmarClave) {
      return res.render("nuevaclave", { error: "Las contraseñas no coinciden." });
    }

    // 1. Actualizar en Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.updateUser({
      password: nuevaClave
    });

    if (authError) {
      console.error("Error actualizando clave en Auth:", authError.message);
      return res.render("nuevaclave", { error: "Error al actualizar la contraseña: " + authError.message });
    }

    // 2. Sincronizar en nuestra tabla personalizada
    const hash = await bcrypt.hash(nuevaClave, 10);
    const { error: dbError } = await supabaseAdmin
      .from('cuenta_usuario')
      .update({ clave: hash })
      .eq('email', user.email);

    if (dbError) {
      console.error("Error sincronizando clave en DB:", dbError.message);
      // No devolvemos error fatal porque al menos la de Auth ya cambió.
    }

    // Limpiar sesión de Supabase local (opcional)
    await supabase.auth.signOut();

    return res.redirect("/auth/login");
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.render("nuevaclave", { error: "Ocurrió un error inesperado." });
  }
};

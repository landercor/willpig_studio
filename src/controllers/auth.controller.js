// src/controllers/auth.controller.js
<<<<<<< HEAD
import { supabaseAdmin as supabase } from "../config/db.js"; // Alias para evitar confusión con el cliente de supabase que podrías usar en el frontend
=======
import { supabase, supabaseAdmin } from "../config/db.js";
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
import bcrypt from "bcrypt";

// --- Vistas de Autenticación (EJS) ---

export const register = async (req, res) => {
  try {
    const { username, correo, contrasena } = req.body;
<<<<<<< HEAD
    console.log("Registering user:", { username, correo }); //Hace log de los datos recibidos (sin contraseña)
=======
    console.log("Registering user:", { username, correo });
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8

    if (!username || !correo || !contrasena) {
      return res.render("register", { error: "Todos los campos son obligatorios." });
    }

<<<<<<< HEAD
    // verificar email duplicado
    const { data: existingUser, error: searchError } = await supabase
      .from('cuenta_usuario')
      .select('email')
      .eq('email', correo)
      .maybeSingle(); // Usa maybeSingle para evitar error si no encuentra usuario

    if (searchError) {
      console.error("Error checking existing user:", searchError);
      return res.render("register", { error: "Error verificando usuario." });
    }

    if (existingUser) {
      console.log("User already exists:", correo);
      return res.render("register", { error: "Ya existe una cuenta con este correo." });
=======
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
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
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

<<<<<<< HEAD
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

=======
    if (insertError) {
      console.error("Error inserting user in DB:", insertError);
      // Opcional: Podríamos borrar el usuario de Auth si falla la DB, pero Supabase Auth no es fácil de "limpiar" por seguridad.
      return res.render("register", { error: "Error al guardar el perfil del usuario." });
    }

>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
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
    console.log("Logging in user:", correo); // Log del correo recibido (sin contraseña)

    if (!correo || !contrasena) {
      return res.render("login", { error: "Completa los campos." });
    }

<<<<<<< HEAD
    const { data: user, error } = await supabase
=======
    const { data: user, error } = await supabaseAdmin
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
      .from('cuenta_usuario')
      .select('*')
      .eq('email', correo)
      .single();

<<<<<<< HEAD
    if (error) {
      console.error("Supabase login error (or user not found):", error);
    }

=======
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
    if (error || !user) {
      return res.render("login", { error: "Usuario o contraseña incorrectos." });
    }

    const ok = await bcrypt.compare(contrasena, user.clave);
    if (!ok) {
<<<<<<< HEAD
      console.log("Password mismatch for:", correo);
      return res.render("login", { error: "Usuario o contraseña incorrectos." });
    }

    // establecer sesion despues de iniciar sesion correctamente
    req.session.userId = user.id_cuenta_usuario;
    req.session.user = user;
    console.log("Login successful, session set for:", user.username);
=======
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
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8

    return res.redirect("/principal");
  } catch (err) {
    console.error("Error in login:", err);
    return res.render("login", { error: "Error al iniciar sesión: " + err.message });
  }
};

<<<<<<< HEAD
// recuperacion de contraseña
=======
// --- Recuperación de Contraseña con Supabase Auth ---

>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
export const forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) {
      return res.render("olvido", { error: "Introduce un correo válido." });
    }

<<<<<<< HEAD
    // checa email si existe en la base de datos
    const { data: user, error } = await supabase
      .from('cuenta_usuario')
      .select('*')
      .eq('email', correo)
      .single();

    if (error || !user) {
      console.log("Email not found for recovery:", correo);
      return res.render("olvido", { error: "No existe una cuenta con ese correo." });
    }

    // Aqui se implementaría la lógica para generar un token de recuperación, guardarlo en la base de datos y enviar
    //  un correo al usuario con el enlace para restablecer su contraseña.
    // Por ahora solo redireccionamos al usuario con un mensaje.

    // puedes pasar un query param o usar la sesión para mostrar un mensaje en la página de login después de enviar el correo
    return res.render("login", {
      error: `Se ha enviado un enlace de recuperación a ${correo}. Revisa tu bandeja de entrada.`
    });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    return res.render("olvido", { error: "Ocurrió un error: " + err.message });
=======
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
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
  }
};

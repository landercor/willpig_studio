// src/controllers/auth.controller.js
import { supabaseAdmin as supabase } from "../config/db.js"; // Alias para evitar confusión con el cliente de supabase que podrías usar en el frontend
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { username, correo, contrasena } = req.body;
    console.log("Registering user:", { username, correo }); //Hace log de los datos recibidos (sin contraseña)

    if (!username || !correo || !contrasena) {
      return res.render("register", { error: "Todos los campos son obligatorios." });
    }

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
    console.log("Logging in user:", correo); // Log del correo recibido (sin contraseña)

    if (!correo || !contrasena) {
      return res.render("login", { error: "Completa los campos." });
    }

    const { data: user, error } = await supabase
      .from('cuenta_usuario')
      .select('*')
      .eq('email', correo)
      .single();

    if (error) {
      console.error("Supabase login error (or user not found):", error);
    }

    if (error || !user) {
      return res.render("login", { error: "Usuario o contraseña incorrectos." });
    }

    const ok = await bcrypt.compare(contrasena, user.clave);
    if (!ok) {
      console.log("Password mismatch for:", correo);
      return res.render("login", { error: "Usuario o contraseña incorrectos." });
    }

    // establecer sesion despues de iniciar sesion correctamente
    req.session.userId = user.id_cuenta_usuario;
    req.session.user = user;
    console.log("Login successful, session set for:", user.username);

    return res.redirect("/principal");
  } catch (err) {
    console.error("Error in login:", err);
    return res.render("login", { error: "Error al iniciar sesión: " + err.message });
  }
};

// recuperacion de contraseña
export const forgotPassword = async (req, res) => {
  try {
    const { correo } = req.body;
    if (!correo) {
      return res.render("olvido", { error: "Introduce un correo válido." });
    }

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
  }
};

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { supabaseAdmin } from "./db.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
      },
      async function (accessToken, refreshToken, profile, cb) {
        try {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          if (!email) {
            return cb(new Error("No email found in Google profile"));
          }

          // 1. Buscar al usuario en la base de datos
          const { data: user, error: searchError } = await supabaseAdmin
            .from("cuenta_usuario")
            .select("*")
            .eq("email", email)
            .single();

          if (user) {
            // Usuario existe, devolver el usuario para iniciar sesión
            return cb(null, user);
          }

          // 2. Si no existe, crear cuenta de usuario
          const randomPassword = Math.random().toString(36).slice(-10);
          const hash = await bcrypt.hash(randomPassword, 10);
          const avatarUrl = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null;

          const { data: newUser, error: insertError } = await supabaseAdmin
            .from("cuenta_usuario")
            .insert([
              {
                username: profile.displayName || email.split("@")[0],
                email: email,
                clave: hash,
                rol: "lector",
                estado: "activa",
                avatar_url: avatarUrl,
              },
            ])
            .select()
            .single();

          if (insertError) {
            console.error("Error creating user from Google Auth:", insertError);
            return cb(insertError);
          }

          return cb(null, newUser);
        } catch (err) {
          console.error("Unexpected error in Google Strategy:", err);
          return cb(err);
        }
      }
    )
  );
}


export default passport;

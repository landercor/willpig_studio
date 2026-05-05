import express from "express";
import { register, login, forgotPassword, resetPassword, authCallback } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", register);

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", login);

// Password recovery routes
router.get("/olvido", (req, res) => {
  res.render("olvido");
});
router.post("/olvido", forgotPassword);

// Callback route for recovery links
router.get("/callback", authCallback);

router.get("/nuevaclave", (req, res) => {
  res.render("nuevaclave");
});
router.post("/nuevaclave", resetPassword);

//Inicio de sesión por medio de Google
import passport from "../config/passport.js";

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/login", session: false }),
  (req, res) => {
    // Autenticación exitosa, el usuario está en req.user gracias a passport
    req.session.userId = req.user.id_cuenta_usuario;
    req.session.user = {
      id: req.user.id_cuenta_usuario,
      username: req.user.username,
      email: req.user.email,
      rol: req.user.rol,
      avatar: req.user.avatar_url,
    };
    res.redirect("/principal");
  }
);

export default router;

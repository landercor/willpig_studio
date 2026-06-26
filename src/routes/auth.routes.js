import express from "express";
import { register, login, forgotPassword, resetPassword, authCallback, logout } from "../controllers/auth.controller.js";
import { validateCsrfToken } from "../middlewares/csrf.js";
import { authLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register", { error: undefined, next: req.query.next || "" });
});
// Rate limiting + validación CSRF en registro
router.post("/register", authLimiter, validateCsrfToken, register);

router.get("/login", (req, res) => {
  res.render("login", { error: undefined, next: req.query.next || "" });
});
// Rate limiting + validación CSRF en login
router.post("/login", authLimiter, validateCsrfToken, login);

router.get("/logout", logout);

// Password recovery routes
router.get("/olvido", (req, res) => {
  res.render("olvido", { error: undefined });
});
router.post("/olvido", validateCsrfToken, forgotPassword);

// Callback route for recovery links
router.get("/callback", authCallback);

router.get("/nuevaclave", (req, res) => {
  res.render("nuevaclave", { error: undefined });
});
router.post("/nuevaclave", validateCsrfToken, resetPassword);

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

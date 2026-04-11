import { Router } from "express";
import { registerUser, loginUser, getProfile } from "../controllers/user.controller.js";

const router = Router();

// Ruta para "Mi Perfil" desde el navbar
router.get("/perfil", (req, res) => {
    if (req.session && req.session.user) {
        res.redirect(`/usuario/profile/${req.session.user.id}`);
    } else {
        res.redirect('/auth/login');
    }
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile/:id", getProfile);

export default router;
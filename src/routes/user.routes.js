import { Router } from "express";
import { apiRegister, apiLogin, getProfile } from "../controllers/user.controller.js";

const router = Router();

// Ruta para "Mi Perfil" desde el navbar
router.get("/perfil", (req, res) => {
    if (req.session && req.session.user) {
        const userId = req.session.user.id || req.session.user.id_cuenta_usuario || req.session.userId;
        console.log("Redirecting to profile -> User ID in session:", userId);
        res.redirect(`/usuario/profile/${userId}`);
    } else {
        res.redirect('/auth/login');
    }
});

router.post("/register", apiRegister);
router.post("/login", apiLogin);
router.get("/profile/:id", getProfile);

export default router;
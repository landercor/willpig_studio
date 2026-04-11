import { Router } from "express";
import { apiRegister, apiLogin, getProfile } from "../controllers/user.controller.js";

const router = Router();

// Ruta para "Mi Perfil" desde el navbar
router.get("/perfil", (req, res) => {
    if (req.session && req.session.user) {
<<<<<<< HEAD
        res.redirect(`/usuario/profile/${req.session.user.id}`);
=======
        const userId = req.session.user.id || req.session.user.id_cuenta_usuario || req.session.userId;
        console.log("Redirecting to profile -> User ID in session:", userId);
        res.redirect(`/usuario/profile/${userId}`);
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
    } else {
        res.redirect('/auth/login');
    }
});

<<<<<<< HEAD
router.post("/register", registerUser);
router.post("/login", loginUser);
=======
router.post("/register", apiRegister);
router.post("/login", apiLogin);
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
router.get("/profile/:id", getProfile);

export default router;
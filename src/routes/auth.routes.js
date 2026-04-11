import express from "express";
<<<<<<< HEAD
import { register, login, forgotPassword } from "../controllers/auth.controller.js";
=======
import { register, login, forgotPassword, resetPassword, authCallback } from "../controllers/auth.controller.js";
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", register);

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", login);

<<<<<<< HEAD
// new routes for password recovery
router.get("/olvido", (req, res) => {
  res.render("olvido");
});

router.post("/olvido", forgotPassword);

=======
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

>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
export default router;

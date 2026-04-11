import express from "express";
import { register, login, forgotPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", register);

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", login);

// new routes for password recovery
router.get("/olvido", (req, res) => {
  res.render("olvido");
});

router.post("/olvido", forgotPassword);

export default router;

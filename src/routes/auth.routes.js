import express from "express";
import { register, login, forgotPassword, resetPassword } from "../controllers/auth.controller.js";

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

router.get("/nuevaclave", (req, res) => {
  res.render("nuevaclave");
});
router.post("/nuevaclave", resetPassword);

export default router;

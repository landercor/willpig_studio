import { Router } from "express";
import { createChapter, getChapters, readChapter } from "../controllers/chapter.controller.js";

const router = Router();

// API Routes
router.post("/new", createChapter); // Should probably use upload middleware if chapters have images later
router.get("/story/:id", getChapters);

// View Routes
router.get("/read/:id", readChapter);

export default router;
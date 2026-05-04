import { Router } from "express";
import { 
    createChapter, 
    getChapters, 
    readChapter, 
    getChapterEditor, 
    updateChapter, 
    deleteChapter 
} from "../controllers/chapter.controller.js";

const router = Router();

// API Routes
router.post("/new", createChapter); 
router.put("/update/:id", updateChapter);
router.delete("/delete/:id", deleteChapter);
router.get("/story/:id", getChapters);

// View Routes
router.get("/read/:id", readChapter);
router.get("/nuevo/:storyId", getChapterEditor); // Vista para crear nuevo
router.get("/editar/:id", getChapterEditor);    // Vista para editar existente

export default router;
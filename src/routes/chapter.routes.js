import { Router } from "express";
import { 
    createChapter, 
    getChapters, 
    readChapter, 
    getChapterEditor, 
    updateChapter, 
    deleteChapter 
} from "../controllers/chapter.controller.js";
import { isAuth } from '../middlewares/isAuth.js';

const router = Router();

// API Routes
router.post("/new", isAuth, createChapter); 
router.put("/update/:id", isAuth, updateChapter);
router.delete("/delete/:id", isAuth, deleteChapter);
router.get("/story/:id", getChapters);

// View Routes
router.get("/read/:id", readChapter);
router.get("/nuevo/:storyId", isAuth, getChapterEditor); // Vista para crear nuevo
router.get("/editar/:id", isAuth, getChapterEditor);    // Vista para editar existente

/*layout for landing pages*/
router.get('/landing', (req, res) => {
    res.render('pages/landing', {
        layout: 'layouts/landing'
    });
});
export default router;
// routes/cuentos.js
import { Router } from 'express'
import {
  createStory,
  editStory,
  getStories,
  getStoriesByCategory,
  getStoryById,
  getMyStories,
  getEditStory,
  getEditMetadata,
  getNewChapter
} from '../controllers/story.controller.js'

import upload from '../middlewares/upload.js'

const router = Router()

router.get('/crear', (req, res) => {
  res.render('newstorys', { loggerUser: req.session.user });
});

router.get('/mis', getMyStories);
router.get('/editar/:id', getEditStory);
router.get('/editar-meta/:id', getEditMetadata);
router.get('/editar/:id/capitulos/nuevo', getNewChapter);

router.post('/new', upload.single('portada'), createStory)
router.post('/editar/:id', upload.single('portada'), editStory)
router.get('/', getStories)
router.get('/category/:id', getStoriesByCategory)
router.get('/:id', getStoryById)

export default router
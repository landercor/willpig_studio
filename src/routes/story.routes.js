// routes/cuentos.js
import { Router } from 'express'
import {
  createStory,
  editStory,
  getStories,
  getStoriesByCategory,
  getStoryById,
  getEditStory,
  getMyStories
} from '../controllers/story.controller.js'

import upload from '../middlewares/upload.js'

const router = Router()

router.get('/crear', (req, res) => {
  res.render('newstorys', { loggerUser: req.session.user });
});

router.get('/editar/:id', getEditStory);

router.get('/mis', getMyStories);

router.post('/new', upload.single('portada'), createStory)
router.post('/editar/:id', upload.single('portada'), editStory)
router.get('/', getStories)
router.get('/category/:id', getStoriesByCategory)
router.get('/:id', getStoryById)

export default router
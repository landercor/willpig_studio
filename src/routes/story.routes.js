// routes/cuentos.js
import { Router } from 'express'
import {
  createStory,
  getStories,
  getStoriesByCategory,
  getStoryById,
  getMyStories
} from '../controllers/story.controller.js'

import upload from '../middlewares/upload.js'

const router = Router()

router.get('/crear', (req, res) => {
  res.render('newstorys', { loggerUser: req.session.user });
});

router.get('/mis', getMyStories);

router.post('/new', upload.single('portada'), createStory)
router.get('/', getStories)
router.get('/category/:id', getStoriesByCategory)
router.get('/:id', getStoryById)

export default router
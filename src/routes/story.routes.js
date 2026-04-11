// routes/cuentos.js
import { Router } from 'express'
import {
  createStory,
  getStories,
  getStoriesByCategory,
  getStoryById
} from '../controllers/story.controller.js'

import upload from '../middlewares/upload.js'

const router = Router()

router.get('/crear', (req, res) => {
  res.render('newstorys', { loggerUser: req.session.user });
});

router.get('/mis', (req, res) => {
  // Check if user is logged in
  if (!req.session.user) return res.redirect('/auth/login');

  // TODO: Implement actual 'My Stories' view
  // For now redirect to library or show a message
  res.redirect('/principal/biblioteca');
});

router.post('/new', upload.single('portada'), createStory)
router.get('/', getStories)
router.get('/category/:id', getStoriesByCategory)
router.get('/:id', getStoryById)

export default router
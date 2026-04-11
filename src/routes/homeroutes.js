import express from 'express';
import { verBiblioteca, verPrincipal } from '../controllers/homecontroller.js';

const router = express.Router();

router.get('/', verPrincipal);
router.get('/biblioteca', verBiblioteca);

export default router;

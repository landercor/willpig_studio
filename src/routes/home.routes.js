import express from 'express';
import { verBiblioteca, verPrincipal, verBusqueda } from '../controllers/homecontroller.js';

const router = express.Router();

router.get('/', verPrincipal);
router.get('/buscar', verBusqueda);
router.get('/biblioteca', verBiblioteca);

export default router;

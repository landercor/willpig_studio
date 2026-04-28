import express from 'express';
<<<<<<< HEAD
import { verBiblioteca, verPrincipal } from '../controllers/homecontroller.js';
=======
import { verBiblioteca, verPrincipal, verBusqueda } from '../controllers/homecontroller.js';
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8

const router = express.Router();

router.get('/', verPrincipal);
<<<<<<< HEAD
=======
router.get('/buscar', verBusqueda);
>>>>>>> 6ded87912962014a4d6dbfaf430042b1f00462f8
router.get('/biblioteca', verBiblioteca);

export default router;

// src/routes/admin.routes.js
import { Router } from 'express';
import { isAdmin } from '../middlewares/isAdmin.js';
import {
  getDashboard,
  getUsuarios,
  editUsuario,
  deleteUsuario,
  getHistorias,
  editHistoria,
  deleteHistoria,
  getCategorias,
  createCategoria,
  editCategoria,
  deleteCategoria
} from '../controllers/admin.controller.js';

const router = Router();

// Aplicar middleware isAdmin a todas las rutas de este router
router.use(isAdmin);

// Dashboard
router.get('/', getDashboard);

// Usuarios
router.get('/usuarios', getUsuarios);
router.post('/usuarios/:id/edit', editUsuario);
router.post('/usuarios/:id/delete', deleteUsuario);

// Historias
router.get('/historias', getHistorias);
router.post('/historias/:id/edit', editHistoria);
router.post('/historias/:id/delete', deleteHistoria);

// Categorías
router.get('/categorias', getCategorias);
router.post('/categorias/new', createCategoria);
router.post('/categorias/:id/edit', editCategoria);
router.post('/categorias/:id/delete', deleteCategoria);

export default router;

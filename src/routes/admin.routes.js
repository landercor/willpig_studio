// src/routes/admin.routes.js
import { Router } from 'express';
import { isAdmin } from '../middlewares/isAdmin.js';
import {
  getDashboard,
  getUsuarios,
  createUsuario,
  editUsuario,
  deleteUsuario,
  getHistorias,
  createHistoria,
  editHistoria,
  deleteHistoria,
  getCategorias,
  createCategoria,
  editCategoria,
  deleteCategoria,
  getCapitulos,
  createCapitulo,
  editCapitulo,
  deleteCapitulo,
  getEtiquetas,
  createEtiqueta,
  editEtiqueta,
  deleteEtiqueta,
  getNotificaciones,
  createNotificacion,
  editNotificacion,
  deleteNotificacion
} from '../controllers/admin.controller.js';

const router = Router();

// Aplicar middleware isAdmin a todas las rutas de este router
router.use(isAdmin);

// Dashboard
router.get('/', getDashboard);

// Usuarios
router.get('/usuarios', getUsuarios);
router.post('/usuarios/new', createUsuario);
router.post('/usuarios/:id/edit', editUsuario);
router.post('/usuarios/:id/delete', deleteUsuario);

// Historias — /new ANTES de /:id para evitar que Express capture 'new' como ID
router.get('/historias', getHistorias);
router.post('/historias/new', createHistoria);
router.post('/historias/:id/edit', editHistoria);
router.post('/historias/:id/delete', deleteHistoria);

// Categorías
router.get('/categorias', getCategorias);
router.post('/categorias/new', createCategoria);
router.post('/categorias/:id/edit', editCategoria);
router.post('/categorias/:id/delete', deleteCategoria);

// Capítulos
router.get('/capitulos', getCapitulos);
router.post('/capitulos/new', createCapitulo);
router.post('/capitulos/:id/edit', editCapitulo);
router.post('/capitulos/:id/delete', deleteCapitulo);

// Etiquetas
router.get('/etiquetas', getEtiquetas);
router.post('/etiquetas/new', createEtiqueta);
router.post('/etiquetas/:id/edit', editEtiqueta);
router.post('/etiquetas/:id/delete', deleteEtiqueta);

// Notificaciones
router.get('/notificaciones', getNotificaciones);
router.post('/notificaciones/new', createNotificacion);
router.post('/notificaciones/:id/edit', editNotificacion);
router.post('/notificaciones/:id/delete', deleteNotificacion);

export default router;

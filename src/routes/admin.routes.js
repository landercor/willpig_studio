// src/routes/admin.routes.js
import { Router } from 'express';
import { isAdmin } from '../middlewares/isAdmin.js';
import { validateCsrfToken } from '../middlewares/csrf.js';
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
router.post('/usuarios/new', validateCsrfToken, createUsuario);
router.post('/usuarios/:id/edit', validateCsrfToken, editUsuario);
router.post('/usuarios/:id/delete', validateCsrfToken, deleteUsuario);

// Historias — /new ANTES de /:id para evitar que Express capture 'new' como ID
router.get('/historias', getHistorias);
router.post('/historias/new', validateCsrfToken, createHistoria);
router.post('/historias/:id/edit', validateCsrfToken, editHistoria);
router.post('/historias/:id/delete', validateCsrfToken, deleteHistoria);

// Categorías
router.get('/categorias', getCategorias);
router.post('/categorias/new', validateCsrfToken, createCategoria);
router.post('/categorias/:id/edit', validateCsrfToken, editCategoria);
router.post('/categorias/:id/delete', validateCsrfToken, deleteCategoria);

// Capítulos
router.get('/capitulos', getCapitulos);
router.post('/capitulos/new', validateCsrfToken, createCapitulo);
router.post('/capitulos/:id/edit', validateCsrfToken, editCapitulo);
router.post('/capitulos/:id/delete', validateCsrfToken, deleteCapitulo);

// Etiquetas
router.get('/etiquetas', getEtiquetas);
router.post('/etiquetas/new', validateCsrfToken, createEtiqueta);
router.post('/etiquetas/:id/edit', validateCsrfToken, editEtiqueta);
router.post('/etiquetas/:id/delete', validateCsrfToken, deleteEtiqueta);

// Notificaciones
router.get('/notificaciones', getNotificaciones);
router.post('/notificaciones/new', validateCsrfToken, createNotificacion);
router.post('/notificaciones/:id/edit', validateCsrfToken, editNotificacion);
router.post('/notificaciones/:id/delete', validateCsrfToken, deleteNotificacion);

export default router;

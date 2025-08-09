const express = require("express");
const router = express.Router();
const categoriaController = require("../controllers/categoria.controller");
const categoriaValidator = require("../validators/categoria.validator");
const autenticarGoogle = require("../middlewares/authGoogle");

// Aplicar middleware de autenticación a todas las rutas
router.use(autenticarGoogle);

const {
  validarAsignacionCategoria,
  validarParametrosConsultaBase,
  validarParametrosConsultaUsuario,
  validarParametrosIconos,
  validarIdCategoria,
  validarCambioEstado,
} = categoriaValidator;

// GET /categorias/base - Obtener todas las categorías base disponibles
router.get(
  "/base",
  validarParametrosConsultaBase,
  categoriaController.obtenerCategoriasBase
);

// GET /categorias/jerarquicas - Obtener categorías base con estructura jerárquica
router.get(
  "/jerarquicas",
  validarParametrosConsultaBase,
  categoriaController.obtenerCategoriasJerarquicas
);

// GET /categorias/usuario - Obtener categorías del usuario
router.get(
  "/usuario",
  validarParametrosConsultaUsuario,
  categoriaController.obtenerCategoriasUsuario
);

// GET /categorias/usuario/:id - Obtener categoría de usuario por ID
router.get(
  "/usuario/:id",
  validarIdCategoria,
  categoriaController.obtenerCategoriaUsuarioPorId
);

// POST /categorias/usuario - Asignar categoría base a usuario
router.post(
  "/usuario",
  validarAsignacionCategoria,
  categoriaController.asignarCategoriaAUsuario
);

// PATCH /categorias/usuario/:id/desactivar - Desactivar categoría de usuario
router.patch(
  "/usuario/:id/desactivar",
  validarCambioEstado,
  categoriaController.desactivarCategoriaUsuario
);

// PATCH /categorias/usuario/:id/reactivar - Reactivar categoría de usuario
router.patch(
  "/usuario/:id/reactivar",
  validarCambioEstado,
  categoriaController.reactivarCategoriaUsuario
);

// GET /categorias/iconos - Obtener iconos disponibles
router.get(
  "/iconos",
  validarParametrosIconos,
  categoriaController.obtenerIconos
);

// GET /categorias/colores - Obtener colores disponibles
router.get("/colores", categoriaController.obtenerColores);

// GET /categorias/tipos-movimiento - Obtener tipos de movimiento disponibles
router.get("/tipos-movimiento", categoriaController.obtenerTiposMovimiento);

module.exports = router;

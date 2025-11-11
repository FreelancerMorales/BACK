const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller");
const usuarioValidator = require("../validators/usuario.validator");
const autenticarGoogle = require("../middlewares/authGoogle");

const { validarActualizacionPerfil, validarEstadisticas } = usuarioValidator;

// POST /usuarios/auth - Crear o actualizar usuario después del login con Google
router.post("/auth", autenticarGoogle, usuarioController.autenticar);

// Aplicar middleware de autenticación a todas las rutas siguientes
router.use(autenticarGoogle);

// GET /usuarios/perfil - Obtener perfil del usuario autenticado
router.get("/perfil", usuarioController.obtenerPerfil);

// PUT /usuarios/perfil - Actualizar perfil del usuario
router.put(
  "/perfil",
  validarActualizacionPerfil,
  usuarioController.actualizarPerfil
);

// GET /usuarios/resumen - Obtener resumen/dashboard del usuario
router.get("/resumen", usuarioController.obtenerResumen);

// POST /usuarios/categorias/inicializar - Inicializar categorías base
router.post("/categorias/inicializar", usuarioController.inicializarCategorias);

// GET /usuarios/estadisticas - Obtener estadísticas del usuario
router.get(
  "/estadisticas",
  validarEstadisticas,
  usuarioController.obtenerEstadisticas
);

// PATCH /usuarios/desactivar - Desactivar cuenta de usuario
router.patch("/desactivar", usuarioController.desactivar);

// PATCH /usuarios/reactivar - Reactivar cuenta de usuario
router.patch("/reactivar", usuarioController.reactivar);

module.exports = router;
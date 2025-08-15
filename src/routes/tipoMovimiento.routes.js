const express = require("express");
const router = express.Router();
const tipoMovimientoController = require("../controllers/tipoMovimiento.controller");
const tipoMovimientoValidator = require("../validators/tipoMovimiento.validator");
const autenticarGoogle = require("../middlewares/authGoogle");

// Aplicar middleware de autenticación a todas las rutas
router.use(autenticarGoogle);

const {
  validarCreacion,
  validarActualizacion,
  validarObtenerPorId,
  validarEliminar,
  validarParametrosConsulta,
} = tipoMovimientoValidator;

// GET /tipos-movimiento - Obtener todos los tipos de movimiento con filtros opcionales
router.get(
  "/",
  validarParametrosConsulta,
  tipoMovimientoController.obtenerTodos
);

// GET /tipos-movimiento/estadisticas - Obtener estadísticas de uso de tipos de movimiento
router.get(
  "/estadisticas",
  tipoMovimientoController.obtenerEstadisticas
);

// GET /tipos-movimiento/:id - Obtener tipo de movimiento específico por ID
router.get(
  "/:id",
  validarObtenerPorId,
  tipoMovimientoController.obtenerPorId
);

// POST /tipos-movimiento - Crear nuevo tipo de movimiento
router.post(
  "/",
  validarCreacion,
  tipoMovimientoController.crear
);

// PUT /tipos-movimiento/:id - Actualizar tipo de movimiento
router.put(
  "/:id",
  validarActualizacion,
  tipoMovimientoController.actualizar
);

// DELETE /tipos-movimiento/:id - Eliminar tipo de movimiento
router.delete(
  "/:id",
  validarEliminar,
  tipoMovimientoController.eliminar
);

// PATCH /tipos-movimiento/:id/reactivar - Reactivar tipo de movimiento
router.patch(
  "/:id/reactivar",
  validarObtenerPorId,
  tipoMovimientoController.reactivar
);

module.exports = router;
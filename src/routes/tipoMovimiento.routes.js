const express = require("express");
const router = express.Router();

const {
  obtenerTiposMovimiento,
  obtenerTipoMovimientoPorId,
  obtenerCategoriasPorTipo,
  obtenerEstadisticasPorTipo,
  crearTipoMovimiento,
  actualizarTipoMovimiento,
  eliminarTipoMovimiento,
} = require("../controllers/tipoMovimiento.controller");

const {
  validarTipoMovimiento,
  validarActualizacionTipoMovimiento,
  manejarErroresValidacion,
} = require("../validators/tipoMovimiento.validator");

// Rutas públicas (solo lectura para usuarios normales)
router.get("/", obtenerTiposMovimiento);
router.get("/:id", obtenerTipoMovimientoPorId);
router.get("/:id/categorias", obtenerCategoriasPorTipo);
router.get("/:id/estadisticas", obtenerEstadisticasPorTipo);

// Rutas administrativas (crear, actualizar, eliminar)
const verificarAdmin = require("../middlewares/verificarAdmin");
router.use(verificarAdmin);

// Luego las rutas
router.post("/", validarTipoMovimiento, manejarErroresValidacion, crearTipoMovimiento);
router.put("/:id", validarActualizacionTipoMovimiento, manejarErroresValidacion, actualizarTipoMovimiento);
router.delete("/:id", eliminarTipoMovimiento);


module.exports = router;
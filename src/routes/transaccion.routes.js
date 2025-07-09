const express = require("express");
const router = express.Router();

const {
  obtenerTransacciones,
  obtenerTransaccionPorId,
  crearTransaccion,
  actualizarTransaccion,
  eliminarTransaccion,
  obtenerEstadisticasTransacciones,
} = require("../controllers/transaccion.controller");

const {
  validarTransaccion,
  validarActualizacionTransaccion,
  validarRangoFechas,
  manejarErroresValidacion,
} = require("../validators/transaccion.validator");

// Rutas para transacciones
// GET /transacciones - Obtener todas las transacciones con filtros
router.get("/", validarRangoFechas, obtenerTransacciones);

// GET /transacciones/estadisticas - Obtener estadísticas
router.get(
  "/estadisticas",
  validarRangoFechas,
  obtenerEstadisticasTransacciones
);

// GET /transacciones/:id - Obtener transacción por ID
router.get("/:id", obtenerTransaccionPorId);

// POST /transacciones - Crear nueva transacción
router.post(
  "/",
  validarTransaccion,
  manejarErroresValidacion,
  crearTransaccion
);

// PUT /transacciones/:id - Actualizar transacción
router.put(
  "/:id",
  validarActualizacionTransaccion,
  manejarErroresValidacion,
  actualizarTransaccion
);

// DELETE /transacciones/:id - Eliminar transacción
router.delete("/:id", eliminarTransaccion);

module.exports = router;
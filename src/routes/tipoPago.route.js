const express = require("express");
const router = express.Router();
const tipoPagoController = require("../controllers/tipoPago.controller");
const tipoPagoValidator = require("../validators/tipoPago.validator");
const autenticarGoogle = require("../middlewares/authGoogle");

// Aplicar middleware de autenticación a todas las rutas
router.use(autenticarGoogle);

const {
  validarCreacion,
  validarActualizacion,
  validarObtenerPorId,
  validarEliminar,
} = tipoPagoValidator;

// GET /tipos-pago/estadisticas - Obtener tipos de pago con estadísticas (debe ir antes del /:id)
router.get("/estadisticas", tipoPagoController.obtenerEstadisticas);

// GET /tipos-pago - Obtener todos los tipos de pago
router.get("/", tipoPagoController.obtenerTodos);

// POST /tipos-pago - Crear nuevo tipo de pago
router.post("/", validarCreacion, tipoPagoController.crear);

// GET /tipos-pago/:id - Obtener tipo de pago específico por ID
router.get("/:id", validarObtenerPorId, tipoPagoController.obtenerPorId);

// PUT /tipos-pago/:id - Actualizar tipo de pago completo
router.put("/:id", validarActualizacion, tipoPagoController.actualizar);

// DELETE /tipos-pago/:id - Eliminar tipo de pago (soft delete)
router.delete("/:id", validarEliminar, tipoPagoController.eliminar);

// PUT /tipos-pago/:id/reactivar - Reactivar tipo de pago (soft restore)
router.patch("/:id/reactivar", tipoPagoValidator.validarObtenerPorId, tipoPagoController.reactivar);

module.exports = router;

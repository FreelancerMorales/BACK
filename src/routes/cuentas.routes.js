const express = require("express");
const router = express.Router();
const cuentasController = require("../controllers/cuentas.controller");
const cuentasValidator = require("../validators/cuentas.validator");
const autenticarGoogle = require("../middlewares/authGoogle");

// Aplicar middleware de autenticación a todas las rutas
router.use(autenticarGoogle);

const {
  validarCreacion,
  validarActualizacion,
  validarObtenerPorId,
  validarEliminar,
  validarParametrosConsulta,
  validarActualizarOrden,
} = cuentasValidator;

// POST /cuentas - Crear nueva cuenta
router.post("/", validarCreacion, cuentasController.crear);

// GET /cuentas - Obtener todas las cuentas del usuario con filtros
router.get("/", validarParametrosConsulta, cuentasController.obtenerTodas);

// GET /cuentas/resumen - Obtener resumen de cuentas
router.get("/resumen", cuentasController.obtenerResumen);

// PATCH /cuentas/orden - Actualizar orden de cuentas
router.patch(
  "/orden",
  validarActualizarOrden,
  cuentasController.actualizarOrden
);

// GET /cuentas/:id - Obtener cuenta específica por ID
router.get("/:id", validarObtenerPorId, cuentasController.obtenerPorId);

// PUT /cuentas/:id - Actualizar cuenta completa
router.put("/:id", validarActualizacion, cuentasController.actualizar);

// DELETE /cuentas/:id - Eliminar cuenta (soft delete)
router.delete("/:id", validarEliminar, cuentasController.eliminar);

module.exports = router;
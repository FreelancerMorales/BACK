const express = require("express");
const router = express.Router();
const transaccionController = require("../controllers/transaccion.controller");
const transaccionValidator = require("../validators/transaccion.validator");
const autenticarGoogle = require("../middlewares/authGoogle");

// Aplicar middleware de autenticación a todas las rutas
router.use(autenticarGoogle);

const {
  validarCreacion,
  validarParametrosConsulta,
  validarResumen,
  validarPorCuenta,
  validarObtenerPorId,
  validarActualizacion,
  validarEliminar,
  validarEtiquetas,
  validarCambioConfirmacion,
} = transaccionValidator;

// POST /transacciones - Crear nueva transacción
router.post(
  "/",
  validarCreacion,
  transaccionController.crear
);

// GET /transacciones - Obtener todas las transacciones del usuario con filtros
router.get(
  "/",
  transaccionValidator.validarParametrosConsulta,
  transaccionController.obtenerTodas
);

// GET /transacciones/resumen - Obtener resumen de transacciones por período
router.get(
  "/resumen",
  transaccionValidator.validarResumen,
  transaccionController.obtenerResumen
);

// GET /transacciones/cuenta/:cuentaId - Obtener transacciones por cuenta
router.get(
  "/cuenta/:cuentaId",
  transaccionValidator.validarPorCuenta,
  transaccionController.obtenerPorCuenta
);

// GET /transacciones/:id - Obtener transacción específica por ID
router.get(
  "/:id",
  transaccionValidator.validarObtenerPorId,
  transaccionController.obtenerPorId
);

// PUT /transacciones/:id - Actualizar transacción completa
router.put(
  "/:id",
  transaccionValidator.validarActualizacion,
  transaccionController.actualizar
);

// DELETE /transacciones/:id - Eliminar transacción
router.delete(
  "/:id",
  transaccionValidator.validarEliminar,
  transaccionController.eliminar
);

// POST /transacciones/:id/etiquetas - Agregar etiquetas a transacción
router.post(
  "/:id/etiquetas",
  transaccionValidator.validarEtiquetas,
  transaccionController.agregarEtiquetas
);

// DELETE /transacciones/:id/etiquetas - Remover etiquetas de transacción
router.delete(
  "/:id/etiquetas",
  transaccionValidator.validarEtiquetas,
  transaccionController.removerEtiquetas
);

// PATCH /transacciones/:id/confirmar - Confirmar transacción
router.patch(
  "/:id/confirmar",
  transaccionValidator.validarCambioConfirmacion,
  transaccionController.confirmar
);

// PATCH /transacciones/:id/desconfirmar - Desconfirmar transacción
router.patch(
  "/:id/desconfirmar",
  transaccionValidator.validarCambioConfirmacion,
  transaccionController.desconfirmar
);

module.exports = router;

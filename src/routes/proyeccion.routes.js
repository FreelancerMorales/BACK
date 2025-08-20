const express = require("express");
const router = express.Router();
const proyeccionController = require("../controllers/proyecciones.controller");
const proyeccionValidator = require("../validators/proyeccion.validator");
const autenticarGoogle = require("../middlewares/authGoogle");

// Aplicar middleware de autenticación a todas las rutas
router.use(autenticarGoogle);

const {
  validarCreacion,
  validarParametrosConsulta,
  validarObtenerPorId,
  validarActualizacion,
  validarEliminar,
  validarCambioEstado,
  validarPorCuenta,
  validarProximasVencer,
  validarCambioSimple,
} = proyeccionValidator;

// POST /proyecciones - Crear nueva proyección
router.post("/", validarCreacion, proyeccionController.crear);

// GET /proyecciones - Obtener todas las proyecciones del usuario con filtros
router.get("/", validarParametrosConsulta, proyeccionController.obtenerTodas);

// GET /proyecciones/proximas-vencer - Obtener proyecciones próximas a vencer
router.get(
  "/proximas-vencer",
  validarProximasVencer,
  proyeccionController.obtenerProximasVencer
);

// GET /proyecciones/recurrentes - Obtener proyecciones recurrentes
router.get("/recurrentes", proyeccionController.obtenerRecurrentes);

// GET /proyecciones/cuenta/:cuentaId - Obtener proyecciones por cuenta
router.get(
  "/cuenta/:cuentaId",
  validarPorCuenta,
  proyeccionController.obtenerPorCuenta
);

// GET /proyecciones/:id - Obtener proyección específica por ID
router.get("/:id", validarObtenerPorId, proyeccionController.obtenerPorId);

// PUT /proyecciones/:id - Actualizar proyección completa
router.put("/:id", validarActualizacion, proyeccionController.actualizar);

// DELETE /proyecciones/:id - Eliminar proyección
router.delete("/:id", validarEliminar, proyeccionController.eliminar);

// PATCH /proyecciones/:id/estado - Cambiar estado de proyección
router.patch(
  "/:id/estado",
  validarCambioEstado,
  proyeccionController.cambiarEstado
);

// PATCH /proyecciones/:id/confirmar - Confirmar proyección
router.patch(
  "/:id/confirmar",
  validarCambioSimple,
  proyeccionController.confirmar
);

// PATCH /proyecciones/:id/omitir - Omitir proyección
router.patch("/:id/omitir", validarCambioSimple, proyeccionController.omitir);

module.exports = router;

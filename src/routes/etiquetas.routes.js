const express = require("express");
const router = express.Router();
const etiquetaController = require("../controllers/etiquetas.controller");
const etiquetaValidator = require("../validators/etiquetas.validator");
const autenticarGoogle = require("../middlewares/authGoogle");

// Aplicar middleware de autenticación a todas las rutas
router.use(autenticarGoogle);

const {
  validarCreacion,
  validarActualizacion,
  validarObtenerPorId,
  validarEliminar,
  validarParametrosConsulta,
  validarTransaccionesEtiqueta,
} = etiquetaValidator;

// POST /etiquetas - Crear nueva etiqueta
router.post("/", validarCreacion, etiquetaController.crear);

// GET /etiquetas/estadisticas - Obtener etiquetas con estadísticas (debe ir antes de /:id)
router.get("/estadisticas", etiquetaController.obtenerConEstadisticas);

// GET /etiquetas - Obtener todas las etiquetas del usuario con filtros
router.get("/", validarParametrosConsulta, etiquetaController.obtenerTodas);

// GET /etiquetas/:id/transacciones - Obtener transacciones de una etiqueta
router.get(
  "/:id/transacciones",
  validarTransaccionesEtiqueta,
  etiquetaController.obtenerTransacciones
);

// GET /etiquetas/:id - Obtener etiqueta específica por ID
router.get("/:id", validarObtenerPorId, etiquetaController.obtenerPorId);

// PUT /etiquetas/:id - Actualizar etiqueta completa
router.put("/:id", validarActualizacion, etiquetaController.actualizar);

// DELETE /etiquetas/:id - Eliminar etiqueta
router.delete("/:id", validarEliminar, etiquetaController.eliminar);

module.exports = router;

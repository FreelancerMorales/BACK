const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportes.controller");
const reportesValidator = require("../validators/reportes.validator");
const autenticarGoogle = require("../middlewares/authGoogle");

// Aplicar middleware de autenticación a todas las rutas
router.use(autenticarGoogle);

const {
  validarResumenGeneral,
  validarGastosPorCategoria,
  validarIngresosPorCategoria,
  validarMovimientosPorCuenta,
  validarTendenciaMensual,
  validarAnalisisEtiquetas,
  validarComparativaPeriodos,
  validarEstadoCuentas,
  validarTopTransacciones,
} = reportesValidator;

// GET /reportes/resumen-general - Resumen financiero general
router.get(
  "/resumen-general",
  validarResumenGeneral,
  reportesController.resumenGeneral
);

// GET /reportes/gastos-categoria - Análisis de gastos por categoría
router.get(
  "/gastos-categoria",
  validarGastosPorCategoria,
  reportesController.gastosPorCategoria
);

// GET /reportes/ingresos-categoria - Análisis de ingresos por categoría
router.get(
  "/ingresos-categoria",
  validarIngresosPorCategoria,
  reportesController.ingresosPorCategoria
);

// GET /reportes/movimientos-cuenta - Movimientos y balance por cuenta
router.get(
  "/movimientos-cuenta",
  validarMovimientosPorCuenta,
  reportesController.movimientosPorCuenta
);

// GET /reportes/tendencia-mensual - Evolución temporal mensual
router.get(
  "/tendencia-mensual",
  validarTendenciaMensual,
  reportesController.tendenciaMensual
);

// GET /reportes/analisis-etiquetas - Estadísticas por etiquetas
router.get(
  "/analisis-etiquetas",
  validarAnalisisEtiquetas,
  reportesController.analisisEtiquetas
);

// GET /reportes/comparativa - Comparación entre dos períodos
router.get(
  "/comparativa",
  validarComparativaPeriodos,
  reportesController.comparativaPeriodos
);

// GET /reportes/estado-cuentas - Estado actual de todas las cuentas
router.get(
  "/estado-cuentas",
  validarEstadoCuentas,
  reportesController.estadoCuentas
);

// GET /reportes/top-transacciones - Top de transacciones más altas
router.get(
  "/top-transacciones",
  validarTopTransacciones,
  reportesController.topTransacciones
);

module.exports = router;

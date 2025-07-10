const express = require("express");
const router = express.Router();

const {
  obtenerCuentas,
  obtenerCuentaPorId,
  obtenerResumenCuenta,
  crearCuenta,
  actualizarCuenta,
  eliminarCuenta,
  reactivarCuenta,
  obtenerSaldoCuenta,
} = require("../controllers/cuenta.controller");

const autenticarGoogle = require("../middlewares/authGoogle");
const {
  validarCuenta,
  manejarErroresValidacion,
} = require("../validators/cuenta.validator");

router.get("/", obtenerCuentas);
router.get("/:id/saldo", obtenerSaldoCuenta);
router.get("/:id", obtenerCuentaPorId);
router.get("/:id/resumen", obtenerResumenCuenta);
router.post("/", validarCuenta, manejarErroresValidacion, crearCuenta);
router.put("/:id", validarCuenta, manejarErroresValidacion, actualizarCuenta);
router.delete("/:id", eliminarCuenta);
router.put("/:id/reactivar", reactivarCuenta);

module.exports = router;

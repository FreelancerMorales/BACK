const express = require("express");
const router = express.Router();
const {
  obtenerCuentasPorUsuario,
  crearCuenta,
  eliminarCuenta,
} = require("../controllers/cuenta.controller");

// GET /cuentas/:usuarioId
router.get("/:usuarioId", obtenerCuentasPorUsuario);

// POST /cuentas
router.post("/", crearCuenta);

// DELETE /cuentas/:id
router.delete("/:id", eliminarCuenta);

module.exports = router;

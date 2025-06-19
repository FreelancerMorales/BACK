const express = require("express");
const router = express.Router();
const {
  obtenerTransaccionesPorUsuario,
  crearTransaccion,
  eliminarTransaccion,
} = require("../controllers/transaccion.controller");

// GET /transacciones/:usuarioId
router.get("/:usuarioId", obtenerTransaccionesPorUsuario);

// POST /transacciones
router.post("/", crearTransaccion);

// DELETE /transacciones/:id
router.delete("/:id", eliminarTransaccion);

module.exports = router;
const express = require("express");
const router = express.Router();
const {
  obtenerTiposMovimiento,
  crearTipoMovimiento,
} = require("../controllers/tipoMovimiento.controller");

// GET /tipos-movimiento
router.get("/", obtenerTiposMovimiento);

// POST /tipos-movimiento
router.post("/", crearTipoMovimiento);

module.exports = router;
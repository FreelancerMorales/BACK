const express = require("express");
const router = express.Router();
const {
  obtenerUsuarios,
  crearUsuario,
} = require("../controllers/usuario.controller");

// GET /usuarios
router.get("/", obtenerUsuarios);

// POST /usuarios
router.post("/", crearUsuario);

module.exports = router;
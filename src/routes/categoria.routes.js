const express = require("express");
const router = express.Router();
const {
  obtenerCategoriasPorUsuario,
  crearCategoria,
  eliminarCategoria,
} = require("../controllers/categoria.controller");

// GET /categorias/:usuarioId
router.get("/:usuarioId", obtenerCategoriasPorUsuario);

// POST /categorias
router.post("/", crearCategoria);

// DELETE /categorias/:id
router.delete("/:id", eliminarCategoria);

module.exports = router;

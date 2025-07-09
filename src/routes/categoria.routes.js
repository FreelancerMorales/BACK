const express = require("express");
const router = express.Router();

const {
  obtenerCategorias,
  obtenerJerarquiaCategorias,
  obtenerCategoriaPorId,
  obtenerEstadisticasCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categoria.controller");

const autenticarGoogle = require("../middlewares/authGoogle");
const {
  validarCategoria,
  validarActualizacionCategoria,
  manejarErroresValidacion,
} = require("../validators/categoria.validator");

// Rutas públicas (ya protegidas por autenticación en index.js)
router.get("/", obtenerCategorias);
router.get("/jerarquia", obtenerJerarquiaCategorias);
router.get("/:id", obtenerCategoriaPorId);
router.get("/:id/estadisticas", obtenerEstadisticasCategoria);

// Rutas que requieren validación
router.post("/", validarCategoria, manejarErroresValidacion, crearCategoria);
router.put(
  "/:id",
  validarActualizacionCategoria,
  manejarErroresValidacion,
  actualizarCategoria
);
router.delete("/:id", eliminarCategoria);

module.exports = router;

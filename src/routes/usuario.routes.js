const express = require("express");
const router = express.Router();
const {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  reactivarUsuario,
  obtenerUsuarioAutenticado,
} = require("../controllers/usuario.controller");

const verificarAdmin = require("../middlewares/verificarAdmin");
const autenticarGoogle = require("../middlewares/authGoogle");
const {
  validarActualizacionUsuario,
  manejarErroresValidacion,
} = require("../validators/usuario.validator");

router.get("/me", autenticarGoogle, obtenerUsuarioAutenticado);
router.get("/", autenticarGoogle, verificarAdmin, obtenerUsuarios);
router.post("/", autenticarGoogle, crearUsuario);
router.put(
  "/:id",
  autenticarGoogle,
  validarActualizacionUsuario,
  manejarErroresValidacion,
  actualizarUsuario
);
router.delete("/:id", autenticarGoogle, eliminarUsuario);
router.put("/:id/reactivar", autenticarGoogle, reactivarUsuario);

module.exports = router;
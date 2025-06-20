const express = require("express");
const router = express.Router();
const {
  obtenerUsuarios,
  crearUsuario,
  esCorreoValido,
  actualizarUsuario,
  eliminarUsuario,
  reactivarUsuario,
  obtenerUsuarioAutenticado, 
} = require("../controllers/usuario.controller");

const autenticarGoogle = require("../middlewares/authGoogle");

router.get("/me", autenticarGoogle, obtenerUsuarioAutenticado);
router.get("/", obtenerUsuarios);
router.post("/", autenticarGoogle, crearUsuario);
router.post("/validar-correo", esCorreoValido);
router.put("/:id", autenticarGoogle, actualizarUsuario);
router.delete("/:id", autenticarGoogle, eliminarUsuario);
router.put("/:id/reactivar", autenticarGoogle, reactivarUsuario);

module.exports = router;

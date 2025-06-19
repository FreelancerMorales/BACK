const express = require("express");
const router = express.Router();
const {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  reactivarUsuario
} = require("../controllers/usuario.controller");

router.get("/", obtenerUsuarios); // paginado
router.post("/", crearUsuario);
router.put("/:id", actualizarUsuario);
router.delete("/:id", eliminarUsuario);
router.post("/reactivar/:id", reactivarUsuario); // Reactivar cuenta

module.exports = router;

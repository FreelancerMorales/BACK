const usuarioService = require("../service/usuario.service");
const { answerOk, answerError } = require("../utils/answers");

class UsuarioController {
  // POST /usuarios/auth - Crear o actualizar usuario después del login con Google
  async autenticar(req, res) {
    try {
      const usuario = await usuarioService.crearOActualizar(req.usuario);

      // Inicializar categorías si es un nuevo usuario
      if (!usuario.creadoEn || new Date() - new Date(usuario.creadoEn) < 1000) {
        await usuarioService.inicializarCategorias(usuario.id);
      }

      return answerOk(res, usuario, "Usuario autenticado exitosamente");
    } catch (error) {
      console.error("Error al autenticar usuario:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /usuarios/perfil - Obtener perfil del usuario autenticado
  async obtenerPerfil(req, res) {
    try {
      const usuario = await usuarioService.obtenerPorId(req.usuario.id);

      if (!usuario) {
        return answerError(res, "Usuario no encontrado", 404);
      }

      return answerOk(res, usuario, "Perfil obtenido exitosamente");
    } catch (error) {
      console.error("Error al obtener perfil:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PUT /usuarios/perfil - Actualizar perfil del usuario
  async actualizarPerfil(req, res) {
    try {
      const usuario = await usuarioService.actualizar(req.usuario.id, req.body);

      return answerOk(res, usuario, "Perfil actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /usuarios/resumen - Obtener resumen/dashboard del usuario
  async obtenerResumen(req, res) {
    try {
      const resumen = await usuarioService.obtenerResumen(req.usuario.id);

      return answerOk(res, resumen, "Resumen obtenido exitosamente");
    } catch (error) {
      console.error("Error al obtener resumen:", error);
      return answerError(res, error.message, 400);
    }
  }

  // POST /usuarios/categorias/inicializar - Inicializar categorías base
  async inicializarCategorias(req, res) {
    try {
      const categorias = await usuarioService.inicializarCategorias(
        req.usuario.id
      );

      return answerOk(res, categorias, "Categorías inicializadas exitosamente");
    } catch (error) {
      console.error("Error al inicializar categorías:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /usuarios/estadisticas - Obtener estadísticas del usuario
  async obtenerEstadisticas(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      if (!fechaInicio || !fechaFin) {
        return answerError(res, "Fechas de inicio y fin son requeridas", 400);
      }

      const estadisticas = await usuarioService.obtenerEstadisticas(
        req.usuario.id,
        fechaInicio,
        fechaFin
      );

      return answerOk(res, estadisticas, "Estadísticas obtenidas exitosamente");
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PATCH /usuarios/desactivar - Desactivar cuenta de usuario
  async desactivar(req, res) {
    try {
      const usuario = await usuarioService.desactivar(req.usuario.id);

      return answerOk(res, usuario, "Usuario desactivado exitosamente");
    } catch (error) {
      console.error("Error al desactivar usuario:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PATCH /usuarios/reactivar - Reactivar cuenta de usuario
  async reactivar(req, res) {
    try {
      const usuario = await usuarioService.reactivar(req.usuario.id);

      return answerOk(res, usuario, "Usuario reactivado exitosamente");
    } catch (error) {
      console.error("Error al reactivar usuario:", error);
      return answerError(res, error.message, 400);
    }
  }
}

module.exports = new UsuarioController();

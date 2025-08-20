const etiquetaService = require("../service/etiquetas.service");
const { answerOk, answerError } = require("../utils/answers");

class EtiquetaController {
  // POST /etiquetas - Crear nueva etiqueta
  async crear(req, res) {
    try {
      const datos = {
        ...req.body,
        usuarioId: req.usuario.id,
      };

      const etiqueta = await etiquetaService.crear(datos);

      return answerOk(res, etiqueta, "Etiqueta creada exitosamente", 201);
    } catch (error) {
      console.error("Error al crear etiqueta:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /etiquetas - Obtener etiquetas del usuario
  async obtenerTodas(req, res) {
    try {
      const opciones = {
        activo:
          req.query.activo !== undefined
            ? req.query.activo === "true"
            : undefined,
      };

      const etiquetas = await etiquetaService.obtenerPorUsuario(
        req.usuario.id,
        opciones
      );

      return answerOk(res, etiquetas, "Etiquetas obtenidas exitosamente");
    } catch (error) {
      console.error("Error al obtener etiquetas:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /etiquetas/:id - Obtener etiqueta por ID
  async obtenerPorId(req, res) {
    try {
      const etiqueta = await etiquetaService.obtenerPorId(
        req.params.id,
        req.usuario.id
      );

      if (!etiqueta) {
        return answerError(res, "Etiqueta no encontrada", 404);
      }

      return answerOk(res, etiqueta, "Etiqueta obtenida exitosamente");
    } catch (error) {
      console.error("Error al obtener etiqueta:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PUT /etiquetas/:id - Actualizar etiqueta
  async actualizar(req, res) {
    try {
      const etiqueta = await etiquetaService.actualizar(
        req.params.id,
        req.body,
        req.usuario.id
      );

      return answerOk(res, etiqueta, "Etiqueta actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar etiqueta:", error);
      return answerError(res, error.message, 400);
    }
  }

  // DELETE /etiquetas/:id - Eliminar etiqueta
  async eliminar(req, res) {
    try {
      await etiquetaService.eliminar(req.params.id, req.usuario.id);

      return answerOk(res, null, "Etiqueta eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar etiqueta:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /etiquetas/estadisticas - Obtener etiquetas con estadísticas
  async obtenerConEstadisticas(req, res) {
    try {
      const etiquetas = await etiquetaService.obtenerConEstadisticas(
        req.usuario.id
      );

      return answerOk(
        res,
        etiquetas,
        "Estadísticas de etiquetas obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener estadísticas de etiquetas:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /etiquetas/:id/transacciones - Obtener transacciones de una etiqueta
  async obtenerTransacciones(req, res) {
    try {
      const opciones = {
        limite: parseInt(req.query.limite) || 50,
        pagina: parseInt(req.query.pagina) || 1,
        fechaInicio: req.query.fechaInicio,
        fechaFin: req.query.fechaFin,
      };

      const resultado = await etiquetaService.obtenerTransacciones(
        req.params.id,
        req.usuario.id,
        opciones
      );

      return answerOk(
        res,
        resultado,
        "Transacciones de etiqueta obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener transacciones de etiqueta:", error);
      return answerError(res, error.message, 400);
    }
  }
}

module.exports = new EtiquetaController();

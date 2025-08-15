const tipoMovimientoService = require("../service/tipoMovimiento.service");
const { answerOk, answerError } = require("../utils/answers");

class TipoMovimientoController {
  // GET /tipos-movimiento - Obtener todos los tipos de movimiento
  async obtenerTodos(req, res) {
    try {
      const tiposMovimiento = await tipoMovimientoService.obtenerTodos();

      return answerOk(
        res,
        tiposMovimiento,
        "Tipos de movimiento obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener tipos de movimiento:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /tipos-movimiento/:id - Obtener tipo de movimiento por ID
  async obtenerPorId(req, res) {
    try {
      const tipoMovimiento = await tipoMovimientoService.obtenerPorId(
        req.params.id
      );

      if (!tipoMovimiento) {
        return answerError(res, "Tipo de movimiento no encontrado", 404);
      }

      return answerOk(
        res,
        tipoMovimiento,
        "Tipo de movimiento obtenido exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener tipo de movimiento:", error);
      return answerError(res, error.message, 400);
    }
  }

  // POST /tipos-movimiento - Crear nuevo tipo de movimiento
  async crear(req, res) {
    try {
      const tipoMovimiento = await tipoMovimientoService.crear(req.body);

      return answerOk(
        res,
        tipoMovimiento,
        "Tipo de movimiento creado exitosamente",
        201
      );
    } catch (error) {
      console.error("Error al crear tipo de movimiento:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PUT /tipos-movimiento/:id - Actualizar tipo de movimiento
  async actualizar(req, res) {
    try {
      const tipoMovimiento = await tipoMovimientoService.actualizar(
        req.params.id,
        req.body
      );

      return answerOk(
        res,
        tipoMovimiento,
        "Tipo de movimiento actualizado exitosamente"
      );
    } catch (error) {
      console.error("Error al actualizar tipo de movimiento:", error);
      return answerError(res, error.message, 400);
    }
  }

  // DELETE /tipos-movimiento/:id - Eliminar tipo de movimiento
  async eliminar(req, res) {
    try {
      const resultado = await tipoMovimientoService.eliminar(req.params.id);

      const mensaje =
        resultado.activo === false
          ? "Tipo de movimiento desactivado exitosamente (tenía transacciones asociadas)"
          : "Tipo de movimiento eliminado exitosamente";

      return answerOk(res, resultado, mensaje);
    } catch (error) {
      console.error("Error al eliminar tipo de movimiento:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /tipos-movimiento/estadisticas - Obtener estadísticas de uso
  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await tipoMovimientoService.obtenerEstadisticas();

      return answerOk(res, estadisticas, "Estadísticas obtenidas exitosamente");
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PATCH /tipos-movimiento/:id/reactivar - Reactivar tipo de movimiento
  async reactivar(req, res) {
    try {
      const tipoMovimiento = await tipoMovimientoService.reactivar(req.params.id);

      return answerOk(
        res,
        tipoMovimiento,
        "Tipo de movimiento reactivado exitosamente"
      );
    } catch (error) {
      console.error("Error al reactivar tipo de movimiento:", error);
      return answerError(res, error.message, 400);
    }
  }
}

module.exports = new TipoMovimientoController();

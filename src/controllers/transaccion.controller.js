const transaccionService = require("../service/transaccion.service");
const { answerOk, answerError } = require("../utils/answers");
class TransaccionController {
  // POST /transacciones - Crear nueva transacción
  async crear(req, res) {
    try {
      const datos = {
        ...req.body,
        usuarioId: req.usuario.id,
      };

      const transaccion = await transaccionService.crear(datos);

      return answerOk(res, transaccion, "Transacción creada exitosamente", 201);
    } catch (error) {
      console.error("Error al crear transacción:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /transacciones - Obtener transacciones del usuario
  async obtenerTodas(req, res) {
    try {
      const opciones = {
        limite: parseInt(req.query.limite) || 50,
        pagina: parseInt(req.query.pagina) || 1,
        fechaInicio: req.query.fechaInicio,
        fechaFin: req.query.fechaFin,
        cuentaId: req.query.cuentaId ? parseInt(req.query.cuentaId) : undefined,
        tipoMovimientoId: req.query.tipoMovimientoId
          ? parseInt(req.query.tipoMovimientoId)
          : undefined,
        confirmada:
          req.query.confirmada !== undefined
            ? req.query.confirmada === "true"
            : undefined,
      };

      const resultado = await transaccionService.obtenerPorUsuario(
        req.usuario.id,
        opciones
      );

      return answerOk(res, resultado, "Transacciones obtenidas exitosamente");
    } catch (error) {
      console.error("Error al obtener transacciones:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /transacciones/:id - Obtener transacción por ID
  async obtenerPorId(req, res) {
    try {
      const transaccion = await transaccionService.obtenerPorId(
        req.params.id,
        req.usuario.id
      );

      if (!transaccion) {
        return answerError(res, "Transacción no encontrada", 404);
      }

      return answerOk(res, transaccion, "Transacción obtenida exitosamente");
    } catch (error) {
      console.error("Error al obtener transacción:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PUT /transacciones/:id - Actualizar transacción
  async actualizar(req, res) {
    try {

      const transaccion = await transaccionService.actualizar(
        req.params.id,
        req.body,
        req.usuario.id
      );

      return answerOk(res, transaccion, "Transacción actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar transacción:", error);
      return answerError(res, error.message, 400);
    }
  }

  // DELETE /transacciones/:id - Eliminar transacción
  async eliminar(req, res) {
    try {
      await transaccionService.eliminar(req.params.id, req.usuario.id);

      return answerOk(res, null, "Transacción eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar transacción:", error);
      return answerError(res, error.message, 400);
    }
  }

  // POST /transacciones/:id/etiquetas - Agregar etiquetas a transacción
  async agregarEtiquetas(req, res) {
    try {

      const { etiquetaIds } = req.body;
      const transaccion = await transaccionService.agregarEtiquetas(
        req.params.id,
        etiquetaIds,
        req.usuario.id
      );

      return answerOk(res, transaccion, "Etiquetas agregadas exitosamente");
    } catch (error) {
      console.error("Error al agregar etiquetas:", error);
      return answerError(res, error.message, 400);
    }
  }

  // DELETE /transacciones/:id/etiquetas - Remover etiquetas de transacción
  async removerEtiquetas(req, res) {
    try {

      const { etiquetaIds } = req.body;
      const transaccion = await transaccionService.removerEtiquetas(
        req.params.id,
        etiquetaIds,
        req.usuario.id
      );

      return answerOk(res, transaccion, "Etiquetas removidas exitosamente");
    } catch (error) {
      console.error("Error al remover etiquetas:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /transacciones/estadisticas - Obtener estadísticas de transacciones
  async obtenerResumen(req, res) {
    try {

      const { fechaInicio, fechaFin } = req.query;

      if (!fechaInicio || !fechaFin) {
        return answerError(res, "Fechas de inicio y fin son requeridas", 400);
      }

      const resumen = await transaccionService.obtenerResumen(
        req.usuario.id,
        fechaInicio,
        fechaFin
      );

      return answerOk(res, resumen, "Resumen obtenido exitosamente");
    } catch (error) {
      console.error("Error al obtener resumen:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /transacciones/cuenta/:cuentaId - Obtener transacciones por cuenta
  async obtenerPorCuenta(req, res) {
    try {
      const opciones = {
        limite: parseInt(req.query.limite) || 20,
        pagina: parseInt(req.query.pagina) || 1,
        fechaInicio: req.query.fechaInicio,
        fechaFin: req.query.fechaFin,
      };

      const resultado = await transaccionService.obtenerPorCuenta(
        parseInt(req.params.cuentaId),
        req.usuario.id,
        opciones
      );

      return answerOk(
        res,
        resultado,
        "Transacciones de cuenta obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener transacciones por cuenta:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PATCH /transacciones/:id/confirmar - Confirmar transacción
  async confirmar(req, res) {
    try {
      const transaccion = await transaccionService.cambiarEstadoConfirmacion(
        req.params.id,
        true,
        req.usuario.id
      );

      return answerOk(res, transaccion, "Transacción confirmada exitosamente");
    } catch (error) {
      console.error("Error al confirmar transacción:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PATCH /transacciones/:id/desconfirmar - Desconfirmar transacción
  async desconfirmar(req, res) {
    try {
      const transaccion = await transaccionService.cambiarEstadoConfirmacion(
        req.params.id,
        false,
        req.usuario.id
      );

      return answerOk(
        res,
        transaccion,
        "Transacción desconfirmada exitosamente"
      );
    } catch (error) {
      console.error("Error al desconfirmar transacción:", error);
      return answerError(res, error.message, 400);
    }
  }
}

module.exports = new TransaccionController();

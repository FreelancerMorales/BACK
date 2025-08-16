const tipoPagoService = require("../service/tipoPago.service");
const { answerOk, answerError } = require("../utils/answers");

class TipoPagoController {
  // POST /tipos-pago - Crear nuevo tipo de pago
  async crear(req, res) {
    try {
      const tipoPago = await tipoPagoService.crear(req.body);
      return answerOk(res, tipoPago, "Tipo de pago creado exitosamente", 201);
    } catch (error) {
      console.error("Error al crear tipo de pago:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /tipos-pago - Obtener todos los tipos de pago
  async obtenerTodos(req, res) {
    try {
      const tiposPago = await tipoPagoService.obtenerTodos();
      return answerOk(res, tiposPago, "Tipos de pago obtenidos exitosamente");
    } catch (error) {
      console.error("Error al obtener tipos de pago:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /tipos-pago/:id - Obtener tipo de pago por ID
  async obtenerPorId(req, res) {
    try {
      const tipoPago = await tipoPagoService.obtenerPorId(req.params.id);

      if (!tipoPago) {
        return answerError(res, "Tipo de pago no encontrado", 404);
      }

      return answerOk(res, tipoPago, "Tipo de pago obtenido exitosamente");
    } catch (error) {
      console.error("Error al obtener tipo de pago:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PUT /tipos-pago/:id - Actualizar tipo de pago
  async actualizar(req, res) {
    try {
      const tipoPago = await tipoPagoService.actualizar(
        req.params.id,
        req.body
      );
      return answerOk(res, tipoPago, "Tipo de pago actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar tipo de pago:", error);
      return answerError(res, error.message, 400);
    }
  }

  // DELETE /tipos-pago/:id - Eliminar tipo de pago
  async eliminar(req, res) {
    try {
      await tipoPagoService.eliminar(req.params.id);
      return answerOk(res, null, "Tipo de pago eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar tipo de pago:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /tipos-pago/estadisticas - Obtener tipos de pago con estadísticas
  async obtenerEstadisticas(req, res) {
    try {
      const estadisticas = await tipoPagoService.obtenerConEstadisticas();
      return answerOk(res, estadisticas, "Estadísticas obtenidas exitosamente");
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PUT /tipos-pago/:id/reactivar - Reactivar tipo de pago
  async reactivar(req, res) {
    try {
      const tipoPago = await tipoPagoService.reactivar(req.params.id);
      return answerOk(res, tipoPago, "Tipo de pago reactivado exitosamente");
    } catch (error) {
      console.error("Error al reactivar tipo de pago:", error);
      return answerError(res, error.message, 400);
    }
  }
}

module.exports = new TipoPagoController();

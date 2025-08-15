const cuentasService = require("../service/cuentas.service");
const { answerOk, answerError } = require("../utils/answers");

class CuentasController {
  // POST /cuentas - Crear nueva cuenta
  async crear(req, res) {
    try {
      const datos = {
        ...req.body,
        usuarioId: req.usuario.id,
      };

      const cuenta = await cuentasService.crear(datos);

      return answerOk(res, cuenta, "Cuenta creada exitosamente", 201);
    } catch (error) {
      console.error("Error al crear cuenta:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /cuentas - Obtener todas las cuentas del usuario
  async obtenerTodas(req, res) {
    try {
      const opciones = {
        activo:
          req.query.activo === "true"
            ? true
            : req.query.activo === "false"
            ? false
            : undefined,
      };

      const cuentas = await cuentasService.obtenerPorUsuario(
        req.usuario.id,
        opciones
      );

      return answerOk(res, cuentas, "Cuentas obtenidas exitosamente");
    } catch (error) {
      console.error("Error al obtener cuentas:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /cuentas/:id - Obtener cuenta por ID
  async obtenerPorId(req, res) {
    try {
      const cuenta = await cuentasService.obtenerPorId(
        req.params.id,
        req.usuario.id
      );

      if (!cuenta) {
        return answerError(res, "Cuenta no encontrada", 404);
      }

      return answerOk(res, cuenta, "Cuenta obtenida exitosamente");
    } catch (error) {
      console.error("Error al obtener cuenta:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PUT /cuentas/:id - Actualizar cuenta
  async actualizar(req, res) {
    try {
      const cuenta = await cuentasService.actualizar(
        req.params.id,
        req.body,
        req.usuario.id
      );

      return answerOk(res, cuenta, "Cuenta actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar cuenta:", error);
      return answerError(res, error.message, 400);
    }
  }

  // DELETE /cuentas/:id - Eliminar cuenta (soft delete)
  async eliminar(req, res) {
    try {
      const cuenta = await cuentasService.eliminar(
        req.params.id,
        req.usuario.id
      );

      return answerOk(res, cuenta, "Cuenta eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar cuenta:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /cuentas/resumen - Obtener resumen de cuentas
  async obtenerResumen(req, res) {
    try {
      const resumen = await cuentasService.obtenerResumen(req.usuario.id);

      return answerOk(res, resumen, "Resumen obtenido exitosamente");
    } catch (error) {
      console.error("Error al obtener resumen:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PATCH /cuentas/orden - Actualizar orden de cuentas
  async actualizarOrden(req, res) {
    try {
      const { ordenCuentas } = req.body;

      if (!Array.isArray(ordenCuentas)) {
        return answerError(
          res,
          "Se requiere un array de cuentas con orden",
          400
        );
      }

      const cuentas = await cuentasService.actualizarOrden(
        req.usuario.id,
        ordenCuentas
      );

      return answerOk(
        res,
        cuentas,
        "Orden de cuentas actualizado exitosamente"
      );
    } catch (error) {
      console.error("Error al actualizar orden de cuentas:", error);
      return answerError(res, error.message, 400);
    }
  }
}

module.exports = new CuentasController();
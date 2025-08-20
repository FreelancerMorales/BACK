const proyeccionService = require("../service/proyeccion.service");
const { answerOk, answerError } = require("../utils/answers");

class ProyeccionController {
  // POST /proyecciones - Crear nueva proyección
  async crear(req, res) {
    try {
      const datos = {
        ...req.body,
        usuarioId: req.usuario.id,
      };

      const proyeccion = await proyeccionService.crear(datos);

      return answerOk(res, proyeccion, "Proyección creada exitosamente", 201);
    } catch (error) {
      console.error("Error al crear proyección:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /proyecciones - Obtener proyecciones del usuario
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
        estado: req.query.estado,
        recurrente:
          req.query.recurrente !== undefined
            ? req.query.recurrente === "true"
            : undefined,
      };

      const resultado = await proyeccionService.obtenerPorUsuario(
        req.usuario.id,
        opciones
      );

      return answerOk(res, resultado, "Proyecciones obtenidas exitosamente");
    } catch (error) {
      console.error("Error al obtener proyecciones:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /proyecciones/:id - Obtener proyección por ID
  async obtenerPorId(req, res) {
    try {
      const proyeccion = await proyeccionService.obtenerPorId(
        req.params.id,
        req.usuario.id
      );

      if (!proyeccion) {
        return answerError(res, "Proyección no encontrada", 404);
      }

      return answerOk(res, proyeccion, "Proyección obtenida exitosamente");
    } catch (error) {
      console.error("Error al obtener proyección:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PUT /proyecciones/:id - Actualizar proyección
  async actualizar(req, res) {
    try {
      const proyeccion = await proyeccionService.actualizar(
        req.params.id,
        req.body,
        req.usuario.id
      );

      return answerOk(res, proyeccion, "Proyección actualizada exitosamente");
    } catch (error) {
      console.error("Error al actualizar proyección:", error);
      return answerError(res, error.message, 400);
    }
  }

  // DELETE /proyecciones/:id - Eliminar proyección
  async eliminar(req, res) {
    try {
      await proyeccionService.eliminar(req.params.id, req.usuario.id);

      return answerOk(res, null, "Proyección eliminada exitosamente");
    } catch (error) {
      console.error("Error al eliminar proyección:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PATCH /proyecciones/:id/estado - Cambiar estado de proyección
  async cambiarEstado(req, res) {
    try {
      const { estado } = req.body;

      if (!estado) {
        return answerError(res, "El estado es requerido", 400);
      }

      const proyeccion = await proyeccionService.cambiarEstado(
        req.params.id,
        estado,
        req.usuario.id
      );

      return answerOk(res, proyeccion, "Estado actualizado exitosamente");
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PATCH /proyecciones/:id/confirmar - Confirmar proyección
  async confirmar(req, res) {
    try {
      const proyeccion = await proyeccionService.cambiarEstado(
        req.params.id,
        "CONFIRMADA",
        req.usuario.id
      );

      return answerOk(res, proyeccion, "Proyección confirmada exitosamente");
    } catch (error) {
      console.error("Error al confirmar proyección:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PATCH /proyecciones/:id/omitir - Omitir proyección
  async omitir(req, res) {
    try {
      const proyeccion = await proyeccionService.cambiarEstado(
        req.params.id,
        "OMITIDA",
        req.usuario.id
      );

      return answerOk(res, proyeccion, "Proyección omitida exitosamente");
    } catch (error) {
      console.error("Error al omitir proyección:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /proyecciones/cuenta/:cuentaId - Obtener proyecciones por cuenta
  async obtenerPorCuenta(req, res) {
    try {
      const opciones = {
        limite: parseInt(req.query.limite) || 20,
        pagina: parseInt(req.query.pagina) || 1,
        fechaInicio: req.query.fechaInicio,
        fechaFin: req.query.fechaFin,
        estado: req.query.estado,
      };

      const resultado = await proyeccionService.obtenerPorCuenta(
        parseInt(req.params.cuentaId),
        req.usuario.id,
        opciones
      );

      return answerOk(
        res,
        resultado,
        "Proyecciones de cuenta obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener proyecciones por cuenta:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /proyecciones/proximas-vencer - Obtener proyecciones próximas a vencer
  async obtenerProximasVencer(req, res) {
    try {
      const dias = parseInt(req.query.dias) || 7;

      const proyecciones = await proyeccionService.obtenerProximasVencer(
        req.usuario.id,
        dias
      );

      return answerOk(
        res,
        proyecciones,
        "Proyecciones próximas a vencer obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener proyecciones próximas a vencer:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /proyecciones/recurrentes - Obtener proyecciones recurrentes
  async obtenerRecurrentes(req, res) {
    try {
      const proyecciones = await proyeccionService.obtenerRecurrentes(
        req.usuario.id
      );

      return answerOk(
        res,
        proyecciones,
        "Proyecciones recurrentes obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener proyecciones recurrentes:", error);
      return answerError(res, error.message, 400);
    }
  }
}

module.exports = new ProyeccionController();

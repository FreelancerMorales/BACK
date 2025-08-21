const reportesService = require("../service/reportes.service");
const { answerOk, answerError } = require("../utils/answers");

class ReportesController {
  // GET /reportes/resumen-general?fechaInicio=...&fechaFin=...
  async resumenGeneral(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      const resumen = await reportesService.resumenGeneral(
        req.usuario.id,
        fechaInicio,
        fechaFin
      );

      return answerOk(res, resumen, "Resumen general obtenido exitosamente");
    } catch (error) {
      console.error("Error al obtener resumen general:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /reportes/gastos-categoria?fechaInicio=...&fechaFin=...
  async gastosPorCategoria(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      const gastos = await reportesService.gastosPorCategoria(
        req.usuario.id,
        fechaInicio,
        fechaFin
      );

      return answerOk(
        res,
        gastos,
        "Gastos por categoría obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener gastos por categoría:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /reportes/ingresos-categoria?fechaInicio=...&fechaFin=...
  async ingresosPorCategoria(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      const ingresos = await reportesService.ingresosPorCategoria(
        req.usuario.id,
        fechaInicio,
        fechaFin
      );

      return answerOk(
        res,
        ingresos,
        "Ingresos por categoría obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener ingresos por categoría:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /reportes/movimientos-cuenta?fechaInicio=...&fechaFin=...
  async movimientosPorCuenta(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      const movimientos = await reportesService.movimientosPorCuenta(
        req.usuario.id,
        fechaInicio,
        fechaFin
      );

      return answerOk(
        res,
        movimientos,
        "Movimientos por cuenta obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener movimientos por cuenta:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /reportes/tendencia-mensual?fechaInicio=...&fechaFin=...
  async tendenciaMensual(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      const tendencia = await reportesService.tendenciaMensual(
        req.usuario.id,
        fechaInicio,
        fechaFin
      );

      return answerOk(
        res,
        tendencia,
        "Tendencia mensual obtenida exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener tendencia mensual:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /reportes/analisis-etiquetas?fechaInicio=...&fechaFin=...
  async analisisEtiquetas(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;

      const analisis = await reportesService.analisisEtiquetas(
        req.usuario.id,
        fechaInicio,
        fechaFin
      );

      return answerOk(
        res,
        analisis,
        "Análisis de etiquetas obtenido exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener análisis de etiquetas:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /reportes/comparativa?fechaInicio1=...&fechaFin1=...&fechaInicio2=...&fechaFin2=...
  async comparativaPeriodos(req, res) {
    try {
      const { fechaInicio1, fechaFin1, fechaInicio2, fechaFin2 } = req.query;

      const comparativa = await reportesService.comparativaPeriodos(
        req.usuario.id,
        fechaInicio1,
        fechaFin1,
        fechaInicio2,
        fechaFin2
      );

      return answerOk(
        res,
        comparativa,
        "Comparativa de períodos obtenida exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener comparativa de períodos:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /reportes/estado-cuentas
  async estadoCuentas(req, res) {
    try {
      const estado = await reportesService.estadoCuentas(req.usuario.id);

      return answerOk(res, estado, "Estado de cuentas obtenido exitosamente");
    } catch (error) {
      console.error("Error al obtener estado de cuentas:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /reportes/top-transacciones?fechaInicio=...&fechaFin=...&limite=10&tipo=GASTO
  async topTransacciones(req, res) {
    try {
      const { fechaInicio, fechaFin, limite, tipo } = req.query;

      const transacciones = await reportesService.topTransacciones(
        req.usuario.id,
        fechaInicio,
        fechaFin,
        parseInt(limite) || 10,
        parseInt(tipo) || 2
      );

      return answerOk(
        res,
        transacciones,
        "Top transacciones obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener top transacciones:", error);
      return answerError(res, error.message, 400);
    }
  }
}

module.exports = new ReportesController();

const { query, validationResult } = require("express-validator");

// Middleware para manejar errores de validación
const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      error: {
        mensaje: "Errores de validación",
        errores: errores.array(),
      },
    });
  }
  next();
};

// Validaciones para fechas básicas (usado en la mayoría de reportes)
const validarFechasBasicas = [
  query("fechaInicio")
    .notEmpty()
    .withMessage("La fecha de inicio es requerida")
    .isISO8601()
    .withMessage("La fecha de inicio debe tener formato válido (ISO 8601)")
    .toDate(),

  query("fechaFin")
    .notEmpty()
    .withMessage("La fecha de fin es requerida")
    .isISO8601()
    .withMessage("La fecha de fin debe tener formato válido (ISO 8601)")
    .toDate(),

  // Validación personalizada para fechas
  query().custom((value, { req }) => {
    const { fechaInicio, fechaFin } = req.query;

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (inicio > fin) {
        throw new Error(
          "La fecha de inicio no puede ser mayor a la fecha de fin"
        );
      }

      // Verificar que el período no sea mayor a 2 años
      const diferenciaDias = (fin - inicio) / (1000 * 60 * 60 * 24);
      if (diferenciaDias > 730) {
        throw new Error("El período de consulta no puede ser mayor a 2 años");
      }
    }

    return true;
  }),

  manejarErroresValidacion,
];

// Validaciones para resumen general
const validarResumenGeneral = [...validarFechasBasicas];

// Validaciones para gastos por categoría
const validarGastosPorCategoria = [...validarFechasBasicas];

// Validaciones para ingresos por categoría
const validarIngresosPorCategoria = [...validarFechasBasicas];

// Validaciones para movimientos por cuenta
const validarMovimientosPorCuenta = [...validarFechasBasicas];

// Validaciones para tendencia mensual
const validarTendenciaMensual = [
  query("fechaInicio")
    .notEmpty()
    .withMessage("La fecha de inicio es requerida")
    .isISO8601()
    .withMessage("La fecha de inicio debe tener formato válido (ISO 8601)")
    .toDate(),

  query("fechaFin")
    .notEmpty()
    .withMessage("La fecha de fin es requerida")
    .isISO8601()
    .withMessage("La fecha de fin debe tener formato válido (ISO 8601)")
    .toDate(),

  // Validación personalizada para tendencia mensual
  query().custom((value, { req }) => {
    const { fechaInicio, fechaFin } = req.query;

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (inicio > fin) {
        throw new Error(
          "La fecha de inicio no puede ser mayor a la fecha de fin"
        );
      }

      // Para tendencia mensual, el período no debe ser mayor a 3 años
      const diferenciaMeses =
        (fin.getFullYear() - inicio.getFullYear()) * 12 +
        (fin.getMonth() - inicio.getMonth());

      if (diferenciaMeses > 36) {
        throw new Error(
          "El período para tendencia mensual no puede ser mayor a 3 años"
        );
      }
    }

    return true;
  }),

  manejarErroresValidacion,
];

// Validaciones para análisis de etiquetas
const validarAnalisisEtiquetas = [...validarFechasBasicas];

// Validaciones para comparativa de períodos
const validarComparativaPeriodos = [
  query("fechaInicio1")
    .notEmpty()
    .withMessage("La fecha de inicio del período 1 es requerida")
    .isISO8601()
    .withMessage(
      "La fecha de inicio del período 1 debe tener formato válido (ISO 8601)"
    )
    .toDate(),

  query("fechaFin1")
    .notEmpty()
    .withMessage("La fecha de fin del período 1 es requerida")
    .isISO8601()
    .withMessage(
      "La fecha de fin del período 1 debe tener formato válido (ISO 8601)"
    )
    .toDate(),

  query("fechaInicio2")
    .notEmpty()
    .withMessage("La fecha de inicio del período 2 es requerida")
    .isISO8601()
    .withMessage(
      "La fecha de inicio del período 2 debe tener formato válido (ISO 8601)"
    )
    .toDate(),

  query("fechaFin2")
    .notEmpty()
    .withMessage("La fecha de fin del período 2 es requerida")
    .isISO8601()
    .withMessage(
      "La fecha de fin del período 2 debe tener formato válido (ISO 8601)"
    )
    .toDate(),

  // Validación personalizada para comparativa
  query().custom((value, { req }) => {
    const { fechaInicio1, fechaFin1, fechaInicio2, fechaFin2 } = req.query;

    if (fechaInicio1 && fechaFin1) {
      const inicio1 = new Date(fechaInicio1);
      const fin1 = new Date(fechaFin1);

      if (inicio1 > fin1) {
        throw new Error(
          "La fecha de inicio del período 1 no puede ser mayor a la fecha de fin"
        );
      }

      // Verificar duración del período 1
      const diferenciaDias1 = (fin1 - inicio1) / (1000 * 60 * 60 * 24);
      if (diferenciaDias1 > 365) {
        throw new Error("El período 1 no puede ser mayor a 1 año");
      }
    }

    if (fechaInicio2 && fechaFin2) {
      const inicio2 = new Date(fechaInicio2);
      const fin2 = new Date(fechaFin2);

      if (inicio2 > fin2) {
        throw new Error(
          "La fecha de inicio del período 2 no puede ser mayor a la fecha de fin"
        );
      }

      // Verificar duración del período 2
      const diferenciaDias2 = (fin2 - inicio2) / (1000 * 60 * 60 * 24);
      if (diferenciaDias2 > 365) {
        throw new Error("El período 2 no puede ser mayor a 1 año");
      }
    }

    return true;
  }),

  manejarErroresValidacion,
];

// Validaciones para estado de cuentas (no requiere parámetros)
const validarEstadoCuentas = [manejarErroresValidacion];

// Validaciones para top transacciones
const validarTopTransacciones = [
  query("fechaInicio")
    .notEmpty()
    .withMessage("La fecha de inicio es requerida")
    .isISO8601()
    .withMessage("La fecha de inicio debe tener formato válido (ISO 8601)")
    .toDate(),

  query("fechaFin")
    .notEmpty()
    .withMessage("La fecha de fin es requerida")
    .isISO8601()
    .withMessage("La fecha de fin debe tener formato válido (ISO 8601)")
    .toDate(),

  query("limite")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("El límite debe ser un entero entre 1 y 50")
    .toInt(),

  query("tipo")
    .optional()
    .isIn([1, 2])
    .withMessage("El tipo debe ser los ID de TipoMovimiento '1' Ingresos o '2' Egresos")
    .toInt(),

  // Validación personalizada para fechas
  query().custom((value, { req }) => {
    const { fechaInicio, fechaFin } = req.query;

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (inicio > fin) {
        throw new Error(
          "La fecha de inicio no puede ser mayor a la fecha de fin"
        );
      }

      // Para top transacciones, límite de 1 año
      const diferenciaDias = (fin - inicio) / (1000 * 60 * 60 * 24);
      if (diferenciaDias > 365) {
        throw new Error(
          "El período para top transacciones no puede ser mayor a 1 año"
        );
      }
    }

    return true;
  }),

  manejarErroresValidacion,
];

module.exports = {
  validarResumenGeneral,
  validarGastosPorCategoria,
  validarIngresosPorCategoria,
  validarMovimientosPorCuenta,
  validarTendenciaMensual,
  validarAnalisisEtiquetas,
  validarComparativaPeriodos,
  validarEstadoCuentas,
  validarTopTransacciones,
  manejarErroresValidacion,
};

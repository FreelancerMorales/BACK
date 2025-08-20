const { body, query, param, validationResult } = require("express-validator");

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

// Validaciones para crear proyección
const validarCreacion = [
  body("monto")
    .notEmpty()
    .withMessage("El monto es requerido")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El monto debe ser un número decimal válido")
    .custom((value) => {
      if (parseFloat(value) <= 0) {
        throw new Error("El monto debe ser mayor a 0");
      }
      return true;
    }),

  body("titulo")
    .notEmpty()
    .withMessage("El título es requerido")
    .isLength({ min: 1, max: 100 })
    .withMessage("El título debe tener entre 1 y 100 caracteres")
    .trim(),

  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder 500 caracteres")
    .trim(),

  body("fecha")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe tener formato válido (ISO 8601)")
    .toDate(),

  body("cuentaId")
    .notEmpty()
    .withMessage("El ID de cuenta es requerido")
    .isInt({ min: 1 })
    .withMessage("El ID de cuenta debe ser un número entero positivo")
    .toInt(),

  body("tipoMovimientoId")
    .notEmpty()
    .withMessage("El tipo de movimiento es requerido")
    .isInt({ min: 1 })
    .withMessage("El tipo de movimiento debe ser un número entero positivo")
    .toInt(),

  body("tipoPagoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El tipo de pago debe ser un número entero positivo")
    .toInt(),

  body("usuarioCategoriaId")
    .notEmpty()
    .withMessage("La categoría es requerida")
    .isInt({ min: 1 })
    .withMessage("La categoría debe ser un número entero positivo")
    .toInt(),

  body("estado")
    .optional()
    .isIn(["PENDIENTE", "CONFIRMADA", "OMITIDA", "VENCIDA"])
    .withMessage(
      "El estado debe ser: PENDIENTE, CONFIRMADA, OMITIDA o VENCIDA"
    ),

  body("recurrente")
    .optional()
    .isBoolean()
    .withMessage("El campo recurrente debe ser booleano")
    .toBoolean(),

  body("frecuencia")
    .optional()
    .isLength({ max: 20 })
    .withMessage("La frecuencia no puede exceder 20 caracteres")
    .trim(),

  body("proximaFecha")
    .optional()
    .isISO8601()
    .withMessage("La próxima fecha debe tener formato válido (ISO 8601)")
    .toDate(),

  body("fechaVencimiento")
    .optional()
    .isISO8601()
    .withMessage("La fecha de vencimiento debe tener formato válido (ISO 8601)")
    .toDate(),

  body("notificar")
    .optional()
    .isBoolean()
    .withMessage("El campo notificar debe ser booleano")
    .toBoolean(),

  body("diasNotificacion")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Los días de notificación deben ser un entero entre 1 y 365")
    .toInt(),

  manejarErroresValidacion,
];

// Validaciones para actualizar proyección
const validarActualizacion = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .toInt(),

  body("monto")
    .optional()
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El monto debe ser un número decimal válido")
    .custom((value) => {
      if (value !== undefined && parseFloat(value) <= 0) {
        throw new Error("El monto debe ser mayor a 0");
      }
      return true;
    }),

  body("titulo")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("El título debe tener entre 1 y 100 caracteres")
    .trim(),

  body("descripcion")
    .optional()
    .isLength({ max: 500 })
    .withMessage("La descripción no puede exceder 500 caracteres")
    .trim(),

  body("fecha")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe tener formato válido (ISO 8601)")
    .toDate(),

  body("cuentaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de cuenta debe ser un número entero positivo")
    .toInt(),

  body("tipoMovimientoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El tipo de movimiento debe ser un número entero positivo")
    .toInt(),

  body("tipoPagoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El tipo de pago debe ser un número entero positivo")
    .toInt(),

  body("usuarioCategoriaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La categoría debe ser un número entero positivo")
    .toInt(),

  body("estado")
    .optional()
    .isIn(["PENDIENTE", "CONFIRMADA", "OMITIDA", "VENCIDA"])
    .withMessage(
      "El estado debe ser: PENDIENTE, CONFIRMADA, OMITIDA o VENCIDA"
    ),

  body("recurrente")
    .optional()
    .isBoolean()
    .withMessage("El campo recurrente debe ser booleano")
    .toBoolean(),

  body("frecuencia")
    .optional()
    .isLength({ max: 20 })
    .withMessage("La frecuencia no puede exceder 20 caracteres")
    .trim(),

  body("proximaFecha")
    .optional()
    .isISO8601()
    .withMessage("La próxima fecha debe tener formato válido (ISO 8601)")
    .toDate(),

  body("fechaVencimiento")
    .optional()
    .isISO8601()
    .withMessage("La fecha de vencimiento debe tener formato válido (ISO 8601)")
    .toDate(),

  body("notificar")
    .optional()
    .isBoolean()
    .withMessage("El campo notificar debe ser booleano")
    .toBoolean(),

  body("diasNotificacion")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Los días de notificación deben ser un entero entre 1 y 365")
    .toInt(),

  manejarErroresValidacion,
];

// Validaciones para obtener por ID
const validarObtenerPorId = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .toInt(),

  manejarErroresValidacion,
];

// Validaciones para eliminar
const validarEliminar = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .toInt(),

  manejarErroresValidacion,
];

// Validaciones para parámetros de consulta (filtros)
const validarParametrosConsulta = [
  query("limite")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("El límite debe ser un entero entre 1 y 100")
    .toInt(),

  query("pagina")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un entero mayor a 0")
    .toInt(),

  query("fechaInicio")
    .optional()
    .isISO8601()
    .withMessage("La fecha de inicio debe tener formato válido (ISO 8601)")
    .toDate(),

  query("fechaFin")
    .optional()
    .isISO8601()
    .withMessage("La fecha de fin debe tener formato válido (ISO 8601)")
    .toDate(),

  query("cuentaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de cuenta debe ser un número entero positivo")
    .toInt(),

  query("tipoMovimientoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El tipo de movimiento debe ser un número entero positivo")
    .toInt(),

  query("estado")
    .optional()
    .isIn(["PENDIENTE", "CONFIRMADA", "OMITIDA", "VENCIDA"])
    .withMessage(
      "El estado debe ser: PENDIENTE, CONFIRMADA, OMITIDA o VENCIDA"
    ),

  query("recurrente")
    .optional()
    .isBoolean()
    .withMessage("El parámetro recurrente debe ser booleano")
    .toBoolean(),

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
    }

    return true;
  }),

  manejarErroresValidacion,
];

// Validaciones para cambio de estado
const validarCambioEstado = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .toInt(),

  body("estado")
    .notEmpty()
    .withMessage("El estado es requerido")
    .isIn(["PENDIENTE", "CONFIRMADA", "OMITIDA", "VENCIDA"])
    .withMessage(
      "El estado debe ser: PENDIENTE, CONFIRMADA, OMITIDA o VENCIDA"
    ),

  manejarErroresValidacion,
];

// Validaciones para proyecciones por cuenta
const validarPorCuenta = [
  param("cuentaId")
    .isInt({ min: 1 })
    .withMessage("El ID de cuenta debe ser un número entero positivo")
    .toInt(),

  ...validarParametrosConsulta,
];

// Validaciones para próximas a vencer
const validarProximasVencer = [
  query("dias")
    .optional()
    .isInt({ min: 1, max: 365 })
    .withMessage("Los días deben ser un entero entre 1 y 365")
    .toInt(),

  manejarErroresValidacion,
];

// Validaciones para confirmar/omitir (solo requiere ID)
const validarCambioSimple = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .toInt(),

  manejarErroresValidacion,
];

module.exports = {
  validarCreacion,
  validarActualizacion,
  validarObtenerPorId,
  validarEliminar,
  validarParametrosConsulta,
  validarCambioEstado,
  validarPorCuenta,
  validarProximasVencer,
  validarCambioSimple,
  manejarErroresValidacion,
};

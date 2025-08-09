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

// Validaciones para crear transacción
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

  body("confirmada")
    .optional()
    .isBoolean()
    .withMessage("El campo confirmada debe ser booleano")
    .toBoolean(),

  body("notas")
    .optional()
    .isLength({ max: 5000 })
    .withMessage("Las notas no pueden exceder 5000 caracteres")
    .trim(),

  manejarErroresValidacion,
];

// Validaciones para actualizar transacción
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

  body("confirmada")
    .optional()
    .isBoolean()
    .withMessage("El campo confirmada debe ser booleano")
    .toBoolean(),

  body("notas")
    .optional()
    .isLength({ max: 5000 })
    .withMessage("Las notas no pueden exceder 5000 caracteres")
    .trim(),

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

  query("confirmada")
    .optional()
    .isBoolean()
    .withMessage("El parámetro confirmada debe ser booleano")
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

// Validaciones para etiquetas
const validarEtiquetas = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID de transacción debe ser un número entero positivo")
    .toInt(),

  body("etiquetaIds")
    .isArray({ min: 1 })
    .withMessage("Se debe proporcionar un array de IDs de etiquetas")
    .custom((value) => {
      if (!value.every((id) => Number.isInteger(id) && id > 0)) {
        throw new Error(
          "Todos los IDs de etiquetas deben ser números enteros positivos"
        );
      }
      return true;
    }),

  manejarErroresValidacion,
];

// Validaciones para resumen
const validarResumen = [
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

      // Verificar que el período no sea mayor a 1 año
      const diferenciaMeses =
        (fin.getFullYear() - inicio.getFullYear()) * 12 +
        (fin.getMonth() - inicio.getMonth());

      if (diferenciaMeses > 12) {
        throw new Error("El período de consulta no puede ser mayor a 1 año");
      }
    }

    return true;
  }),

  manejarErroresValidacion,
];

// Validaciones para transacciones por cuenta
const validarPorCuenta = [
  param("cuentaId")
    .isInt({ min: 1 })
    .withMessage("El ID de cuenta debe ser un número entero positivo")
    .toInt(),

  ...validarParametrosConsulta,
];

// Validaciones para confirmar/desconfirmar
const validarCambioConfirmacion = [
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
  validarEtiquetas,
  validarResumen,
  validarPorCuenta,
  validarCambioConfirmacion,
  manejarErroresValidacion,
};

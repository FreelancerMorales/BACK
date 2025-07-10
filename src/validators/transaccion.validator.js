const { body, validationResult } = require("express-validator");

// Validaciones para crear transacción
const validarTransaccion = [
  body("monto")
    .isFloat({ gt: 0 })
    .withMessage("El monto debe ser un número positivo")
    .custom((value) => {
      const rounded = Math.round(value * 100) / 100;
      if (rounded !== parseFloat(value)) {
        throw new Error("El monto no puede tener más de 2 decimales");
      }
      return true;
    }),

  body("descripcion")
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage("La descripción no puede exceder 255 caracteres")
    .trim(),

  body("fecha")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe tener formato ISO 8601")
    .toDate(),

  body("cuentaId")
    .isInt({ min: 1 })
    .withMessage("El ID de cuenta debe ser un número entero positivo"),

  body("categoriaId")
    .isInt({ min: 1 })
    .withMessage("El ID de categoría debe ser un número entero positivo"),

  body("tipoMovimientoId")
    .isInt({ min: 1 })
    .withMessage(
      "El ID de tipo de movimiento debe ser un número entero positivo"
    ),

  body("tipoPagoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de tipo de pago debe ser un número entero positivo"),

  body("plantillaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de plantilla debe ser un número entero positivo"),

  body("etiquetaIds")
    .optional()
    .isArray()
    .withMessage("Las etiquetas deben ser un array")
    .custom((value) => {
      if (!Array.isArray(value)) return true;

      const validIds = value.every((id) => Number.isInteger(id) && id > 0);
      if (!validIds) {
        throw new Error(
          "Todos los IDs de etiquetas deben ser números enteros positivos"
        );
      }

      // Verificar que no haya duplicados
      const uniqueIds = [...new Set(value)];
      if (uniqueIds.length !== value.length) {
        throw new Error("No se permiten etiquetas duplicadas");
      }

      return true;
    }),
];

// Validaciones para actualizar transacción
const validarActualizacionTransaccion = [
  body("monto")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("El monto debe ser un número positivo")
    .custom((value) => {
      if (value === undefined) return true;
      const rounded = Math.round(value * 100) / 100;
      if (rounded !== parseFloat(value)) {
        throw new Error("El monto no puede tener más de 2 decimales");
      }
      return true;
    }),

  body("descripcion")
    .optional()
    .isString()
    .isLength({ max: 255 })
    .withMessage("La descripción no puede exceder 255 caracteres")
    .trim(),

  body("fecha")
    .optional()
    .isISO8601()
    .withMessage("La fecha debe tener formato ISO 8601")
    .toDate(),

  body("cuentaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de cuenta debe ser un número entero positivo"),

  body("categoriaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de categoría debe ser un número entero positivo"),

  body("tipoMovimientoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "El ID de tipo de movimiento debe ser un número entero positivo"
    ),

  body("tipoPagoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de tipo de pago debe ser un número entero positivo"),

  body("etiquetaIds")
    .optional()
    .isArray()
    .withMessage("Las etiquetas deben ser un array")
    .custom((value) => {
      if (value === undefined || !Array.isArray(value)) return true;

      const validIds = value.every((id) => Number.isInteger(id) && id > 0);
      if (!validIds) {
        throw new Error(
          "Todos los IDs de etiquetas deben ser números enteros positivos"
        );
      }

      // Verificar que no haya duplicados
      const uniqueIds = [...new Set(value)];
      if (uniqueIds.length !== value.length) {
        throw new Error("No se permiten etiquetas duplicadas");
      }

      return true;
    }),
];

// Validaciones para filtros de consulta
const validarFiltrosConsulta = [
  body("fechaInicio")
    .optional()
    .isISO8601()
    .withMessage("La fecha de inicio debe tener formato ISO 8601")
    .toDate(),

  body("fechaFin")
    .optional()
    .isISO8601()
    .withMessage("La fecha de fin debe tener formato ISO 8601")
    .toDate(),

  body("cuentaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de cuenta debe ser un número entero positivo"),

  body("categoriaId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de categoría debe ser un número entero positivo"),

  body("tipoMovimientoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "El ID de tipo de movimiento debe ser un número entero positivo"
    ),
];

// Validación personalizada para verificar que fecha inicio <= fecha fin
const validarRangoFechas = (req, res, next) => {
  const { fechaInicio, fechaFin } = req.query;

  if (fechaInicio && fechaFin) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (inicio > fin) {
      return res.status(400).json({
        ok: false,
        error: {
          mensaje: "La fecha de inicio no puede ser mayor que la fecha de fin",
        },
      });
    }
  }

  next();
};

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

module.exports = {
  validarTransaccion,
  validarActualizacionTransaccion,
  validarFiltrosConsulta,
  validarRangoFechas,
  manejarErroresValidacion,
};

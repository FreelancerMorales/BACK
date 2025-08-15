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

// Validaciones para crear cuenta
const validarCreacion = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres")
    .trim(),

  body("tipo")
    .notEmpty()
    .withMessage("El tipo de cuenta es requerido")
    .isIn(["CORRIENTE", "AHORROS", "CREDITO", "EFECTIVO", "INVERSION"])
    .withMessage(
      "El tipo de cuenta debe ser: CORRIENTE, AHORROS, CREDITO, EFECTIVO o INVERSION"
    ),

  body("color")
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage("El color debe ser un código hexadecimal válido (#RRGGBB)")
    .isLength({ min: 7, max: 7 })
    .withMessage("El color debe tener exactamente 7 caracteres"),

  body("montoInicial")
    .optional()
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El monto inicial debe ser un número decimal válido")
    .custom((value) => {
      if (value !== undefined && parseFloat(value) < 0) {
        throw new Error("El monto inicial no puede ser negativo");
      }
      return true;
    }),

  body("orden")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El orden debe ser un número entero no negativo")
    .toInt(),

  manejarErroresValidacion,
];

// Validaciones para actualizar cuenta
const validarActualizacion = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .toInt(),

  body("nombre")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres")
    .trim(),

  body("tipo")
    .optional()
    .isIn(["CORRIENTE", "AHORROS", "CREDITO", "EFECTIVO", "INVERSION"])
    .withMessage(
      "El tipo de cuenta debe ser: CORRIENTE, AHORROS, CREDITO, EFECTIVO o INVERSION"
    ),

  body("color")
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage("El color debe ser un código hexadecimal válido (#RRGGBB)")
    .isLength({ min: 7, max: 7 })
    .withMessage("El color debe tener exactamente 7 caracteres"),

  body("orden")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El orden debe ser un número entero no negativo")
    .toInt(),

  body("activo")
    .optional()
    .isBoolean()
    .withMessage("El campo activo debe ser booleano")
    .toBoolean(),

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
  query("activo")
    .optional()
    .isBoolean()
    .withMessage("El parámetro activo debe ser booleano")
    .toBoolean(),

  manejarErroresValidacion,
];

// Validaciones para actualizar orden
const validarActualizarOrden = [
  body("ordenCuentas")
    .isArray({ min: 1 })
    .withMessage("Se debe proporcionar un array de cuentas")
    .custom((value) => {
      if (
        !value.every(
          (item) =>
            item &&
            typeof item === "object" &&
            item.id &&
            Number.isInteger(parseInt(item.id)) &&
            parseInt(item.id) > 0
        )
      ) {
        throw new Error("Cada elemento debe tener un ID válido");
      }

      // Verificar que no hay IDs duplicados
      const ids = value.map((item) => parseInt(item.id));
      const uniqueIds = [...new Set(ids)];
      if (ids.length !== uniqueIds.length) {
        throw new Error("No se permiten IDs duplicados");
      }

      return true;
    }),

  manejarErroresValidacion,
];

module.exports = {
  validarCreacion,
  validarActualizacion,
  validarObtenerPorId,
  validarEliminar,
  validarParametrosConsulta,
  validarActualizarOrden,
  manejarErroresValidacion,
};
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

// Validaciones para crear etiqueta
const validarCreacion = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 1, max: 100 })
    .withMessage("El nombre debe tener entre 1 y 100 caracteres")
    .trim(),

  body("color")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("El color debe ser un código hexadecimal válido (#RRGGBB)"),

  body("descripcion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede exceder 200 caracteres")
    .trim(),

  body("activo")
    .optional()
    .isBoolean()
    .withMessage("El campo activo debe ser booleano")
    .toBoolean(),

  manejarErroresValidacion,
];

// Validaciones para actualizar etiqueta
const validarActualizacion = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .toInt(),

  body("nombre")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("El nombre debe tener entre 1 y 100 caracteres")
    .trim(),

  body("color")
    .optional()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("El color debe ser un código hexadecimal válido (#RRGGBB)"),

  body("descripcion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede exceder 200 caracteres")
    .trim(),

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

// Validaciones para obtener transacciones de etiqueta
const validarTransaccionesEtiqueta = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID de etiqueta debe ser un número entero positivo")
    .toInt(),

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

module.exports = {
  validarCreacion,
  validarActualizacion,
  validarObtenerPorId,
  validarEliminar,
  validarParametrosConsulta,
  validarTransaccionesEtiqueta,
  manejarErroresValidacion,
};

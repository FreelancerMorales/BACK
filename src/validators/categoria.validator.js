const { body, param, query, validationResult } = require("express-validator");

const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      ok: false,
      error: {
        mensaje: "Errores de validación",
        detalles: errores.array(),
      },
    });
  }
  next();
};

const validarAsignacionCategoria = [
  body("categoriaBaseId")
    .isInt({ min: 1 })
    .withMessage("El ID de categoría base debe ser un número entero positivo"),

  body("tipoMovimientoId")
    .isInt({ min: 1 })
    .withMessage(
      "El ID de tipo de movimiento debe ser un número entero positivo"
    ),

  manejarErroresValidacion,
];

const validarParametrosConsultaBase = [
  query("tipoMovimientoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "El ID de tipo de movimiento debe ser un número entero positivo"
    ),

  manejarErroresValidacion,
];

const validarParametrosConsultaUsuario = [
  query("tipoMovimientoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "El ID de tipo de movimiento debe ser un número entero positivo"
    ),

  manejarErroresValidacion,
];

const validarParametrosIconos = [
  query("categoria")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage(
      "La categoría debe ser una cadena de texto válida (1-50 caracteres)"
    ),

  manejarErroresValidacion,
];

const validarIdCategoria = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo"),

  manejarErroresValidacion,
];

const validarCambioEstado = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo"),

  manejarErroresValidacion,
];

module.exports = {
  validarAsignacionCategoria,
  validarParametrosConsultaBase,
  validarParametrosConsultaUsuario,
  validarParametrosIconos,
  validarIdCategoria,
  validarCambioEstado,
  manejarErroresValidacion,
};

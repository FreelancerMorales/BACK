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

// Validaciones para crear tipo de pago
const validarCreacion = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ max: 50 })
    .withMessage("El nombre no puede exceder 50 caracteres")
    .trim(),

  body("descripcion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede exceder 200 caracteres")
    .trim(),

  body("orden")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El orden debe ser un número entero mayor o igual a 0")
    .toInt(),

  body("requiereReferencia")
    .optional()
    .isBoolean()
    .withMessage("El campo requiereReferencia debe ser booleano")
    .toBoolean(),

  body("activo")
    .optional()
    .isBoolean()
    .withMessage("El campo activo debe ser booleano")
    .toBoolean(),

  manejarErroresValidacion,
];

// Validaciones para actualizar tipo de pago
const validarActualizacion = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .toInt(),

  body("nombre")
    .optional()
    .isLength({ max: 50 })
    .withMessage("El nombre no puede exceder 50 caracteres")
    .trim(),

  body("descripcion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede exceder 200 caracteres")
    .trim(),

  body("orden")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El orden debe ser un número entero mayor o igual a 0")
    .toInt(),

  body("requiereReferencia")
    .optional()
    .isBoolean()
    .withMessage("El campo requiereReferencia debe ser booleano")
    .toBoolean(),

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

module.exports = {
  validarCreacion,
  validarActualizacion,
  validarObtenerPorId,
  validarEliminar,
  manejarErroresValidacion,
};

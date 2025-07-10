const { body, validationResult } = require("express-validator");

// Validaciones para crear tipo de movimiento
const validarTipoMovimiento = [
  body("nombre")
    .isString()
    .notEmpty()
    .withMessage("El nombre del tipo de movimiento es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),
];

// Validaciones para actualizar tipo de movimiento
const validarActualizacionTipoMovimiento = [
  body("nombre")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("El nombre del tipo de movimiento no puede estar vacío")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .trim()
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),
];

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
  validarTipoMovimiento,
  validarActualizacionTipoMovimiento,
  manejarErroresValidacion,
};
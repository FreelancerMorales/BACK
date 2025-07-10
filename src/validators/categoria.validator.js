const { body, validationResult } = require("express-validator");

// Validaciones para crear categoría
const validarCategoria = [
  body("nombre")
    .isString()
    .notEmpty()
    .withMessage("El nombre de la categoría es obligatorio")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  body("icono")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("El icono debe ser una cadena de máximo 100 caracteres"),
  body("color")
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage(
      "El color debe ser un código hexadecimal válido (ej: #FF5733)"
    ),
  body("tipoMovimientoId")
    .isInt({ min: 1 })
    .withMessage(
      "El tipo de movimiento es obligatorio y debe ser un número entero válido"
    ),
  body("padreId")
    .optional()
    .isInt({ min: 1 })
    .withMessage(
      "El ID de la categoría padre debe ser un número entero válido"
    ),
];

// Validaciones para actualizar categoría
const validarActualizacionCategoria = [
  body("nombre")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("El nombre de la categoría no puede estar vacío")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  body("icono")
    .optional()
    .isString()
    .isLength({ max: 100 })
    .withMessage("El icono debe ser una cadena de máximo 100 caracteres"),
  body("color")
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage(
      "El color debe ser un código hexadecimal válido (ej: #FF5733)"
    ),
  body("tipoMovimientoId")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El tipo de movimiento debe ser un número entero válido"),
  body("padreId")
    .optional()
    .custom((value) => {
      if (value === null || value === undefined || value === "") {
        return true; // Permitir null/undefined/empty para eliminar padre
      }
      return Number.isInteger(Number(value)) && Number(value) > 0;
    })
    .withMessage(
      "El ID de la categoría padre debe ser un número entero válido o null"
    ),
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
  validarCategoria,
  validarActualizacionCategoria,
  manejarErroresValidacion,
};
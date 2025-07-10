const { body, validationResult } = require("express-validator");

// Validaciones para actualizar usuario
const validarActualizacionUsuario = [
  body("nombre")
    .optional()
    .isString()
    .notEmpty()
    .withMessage("El nombre debe ser una cadena no vacía"),
  body("foto")
    .optional()
    .isURL()
    .withMessage("La foto debe ser una URL válida"),
];

const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

module.exports = {
  validarActualizacionUsuario,
  manejarErroresValidacion,
};
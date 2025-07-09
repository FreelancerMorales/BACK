const { body, validationResult } = require("express-validator");

const validarCuenta = [
  body("nombre")
    .isString()
    .notEmpty()
    .withMessage("El nombre de la cuenta es obligatorio"),
  body("tipo")
    .isString()
    .notEmpty()
    .withMessage("Tipo de cuenta vacio o inválido"),
  body("color")
    .optional()
    .matches(/^#[0-9A-F]{6}$/i)
    .withMessage("El color debe ser un código hexadecimal válido"),
  body("montoInicial")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("El monto inicial debe ser un número positivo"),
];

const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }
  next();
};

module.exports = {
  validarCuenta,
  manejarErroresValidacion,
};

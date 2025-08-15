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

// Validaciones para crear tipo de movimiento
const validarCreacion = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios")
    .trim()
    .customSanitizer(value => value.toUpperCase()),

  body("descripcion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede exceder 200 caracteres")
    .trim(),

  body("transferencia")
    .optional()
    .isBoolean()
    .withMessage("El campo transferencia debe ser booleano")
    .toBoolean(),

  body("activo")
    .optional()
    .isBoolean()
    .withMessage("El campo activo debe ser booleano")
    .toBoolean(),

  manejarErroresValidacion,
];

// Validaciones para actualizar tipo de movimiento
const validarActualizacion = [
  param("id")
    .isInt({ min: 1 })
    .withMessage("El ID debe ser un número entero positivo")
    .toInt(),

  body("nombre")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres")
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios")
    .trim()
    .customSanitizer(value => value ? value.toUpperCase() : value),

  body("descripcion")
    .optional()
    .isLength({ max: 200 })
    .withMessage("La descripción no puede exceder 200 caracteres")
    .trim(),

  body("transferencia")
    .optional()
    .isBoolean()
    .withMessage("El campo transferencia debe ser booleano")
    .toBoolean(),

  body("activo")
    .optional()
    .isBoolean()
    .withMessage("El campo activo debe ser booleano")
    .toBoolean(),

  // Validar que al menos un campo esté presente
  body().custom((value, { req }) => {
    const { nombre, descripcion, transferencia, activo } = req.body;
    
    if (!nombre && descripcion === undefined && transferencia === undefined && activo === undefined) {
      throw new Error("Debe proporcionar al menos un campo para actualizar");
    }
    
    return true;
  }),

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

  query("transferencia")
    .optional()
    .isBoolean()
    .withMessage("El parámetro transferencia debe ser booleano")
    .toBoolean(),

  query("nombre")
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage("El nombre debe tener entre 1 y 50 caracteres")
    .trim(),

  manejarErroresValidacion,
];

// Validaciones para reactivar
const validarReactivar = [
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
  validarReactivar,
  manejarErroresValidacion,
};
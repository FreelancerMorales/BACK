const { body, query, validationResult } = require("express-validator");

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

// Validaciones para actualizar perfil
const validarActualizacionPerfil = [
  body("nombre")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage("El nombre debe tener entre 2 y 100 caracteres")
    .trim()
    .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
    .withMessage("El nombre solo puede contener letras y espacios"),

  body("correo")
    .optional()
    .isEmail()
    .withMessage("El correo debe tener un formato válido")
    .isLength({ max: 150 })
    .withMessage("El correo no puede exceder 150 caracteres")
    .normalizeEmail(),

  body("foto")
    .optional()
    .isURL()
    .withMessage("La foto debe ser una URL válida")
    .isLength({ max: 500 })
    .withMessage("La URL de la foto no puede exceder 500 caracteres"),

  manejarErroresValidacion,
];

// Validaciones para parámetros de estadísticas
const validarEstadisticas = [
  query("fechaInicio")
    .notEmpty()
    .withMessage("La fecha de inicio es requerida")
    .isISO8601()
    .withMessage("La fecha de inicio debe tener formato válido (ISO 8601)")
    .toDate(),

  query("fechaFin")
    .notEmpty()
    .withMessage("La fecha de fin es requerida")
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

      // Verificar que el período no sea mayor a 2 años
      const diferenciaMeses =
        (fin.getFullYear() - inicio.getFullYear()) * 12 +
        (fin.getMonth() - inicio.getMonth());

      if (diferenciaMeses > 24) {
        throw new Error("El período de consulta no puede ser mayor a 2 años");
      }

      // Verificar que no sea una fecha futura más allá de hoy
      const hoy = new Date();
      if (fin > hoy) {
        throw new Error("La fecha de fin no puede ser mayor a la fecha actual");
      }
    }

    return true;
  }),

  manejarErroresValidacion,
];

module.exports = {
  validarActualizacionPerfil,
  validarEstadisticas,
  manejarErroresValidacion,
};

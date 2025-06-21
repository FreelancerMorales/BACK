const handlingError = (err, req, res, next) => {
  console.error("🔴 ERROR GLOBAL:", err);

  const status = err.status || 500;
  const mensaje = err.message || "Error interno del servidor";

  res.status(status).json({
    ok: false,
    error: {
      mensaje,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
};

module.exports = handlingError;
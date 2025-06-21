const answerOk = (
  res,
  datos = {},
  mensaje = "Operación exitosa",
  status = 200
) => {
  return res.status(status).json({
    ok: true,
    mensaje,
    datos,
  });
};

const answerError = (res, mensaje = "Error interno", status = 500) => {
  return res.status(status).json({
    ok: false,
    error: { mensaje },
  });
};

module.exports = {
  answerOk,
  answerError,
};
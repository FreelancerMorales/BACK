const { answerError } = require("../utils/answers");

/**
 * Middleware para verificar si el usuario tiene permisos de administrador
 * Por ahora verifica si el usuario es 'sistema' o tiene un dominio específico
 * Puedes modificar la lógica según tus necesidades
 */
const verificarAdmin = (req, res, next) => {
  const usuario = req.usuario;

  // Verificar si es usuario del sistema
  if (usuario.id === "sistema") {
    return next();
  }
  
  const dominiosAdmin = [
    "circuitosapiens34@gmail.com",
  ];

  if (dominiosAdmin.includes(usuario.correo)) {
    return next();
  }

  // const usuarioDB = await prisma.usuario.findUnique({
  //   where: { id: usuario.id },
  //   select: { esAdmin: true }
  // });
  // if (usuarioDB?.esAdmin) {
  //   return next();
  // }

  return answerError(
    res,
    "No tienes permisos suficientes para realizar esta acción",
    403
  );
};

module.exports = verificarAdmin;
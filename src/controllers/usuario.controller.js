const prisma = require("../prismaClient");
const { answerOk, answerError } = require("../utils/answers");
const clonarCategoriasDesdeSistema = require("../utils/clonarCategoriasDesdeSistema");

// GET /usuarios
const obtenerUsuarios = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * limit;

  try {
    const usuarios = await prisma.usuario.findMany({
      where: { activo: true },
      orderBy: { creadoEn: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.usuario.count({ where: { activo: true } });

    return answerOk(
      res,
      {
        usuarios,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
      "Usuarios obtenidos correctamente"
    );
  } catch (error) {
    console.error(`obtenerUsuarios: Error para usuario ${req.usuario.id}:`, error);
    return answerError(res, "Error al obtener usuarios");
  }
};

// GET /usuarios/me
const obtenerUsuarioAutenticado = async (req, res) => {
  const { id } = req.usuario;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario || !usuario.activo) {
      return answerError(res, "Usuario no encontrado o inactivo", 404);
    }

    return answerOk(res, usuario, "Usuario autenticado");
  } catch (error) {
    console.error("obtenerUsuarioAutenticado: Error:", error);
    return answerError(res, "Error al obtener usuario autenticado");
  }
};

// POST /usuarios
const crearUsuario = async (req, res) => {
  const { id, nombre, correo, foto } = req.usuario;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({ where: { id } });

    if (usuarioExistente) {
      return answerOk(res, usuarioExistente, "Usuario ya registrado");
    }

    const nuevoUsuario = await prisma.usuario.create({
      data: { id, nombre, correo, foto },
    });

    // Clonar categorías base solo después de crear el usuario
    await clonarCategoriasDesdeSistema(nuevoUsuario.id);

    return answerOk(res, nuevoUsuario, "Usuario creado correctamente", 201);
  } catch (error) {
    console.error("crearUsuario: Error:", error);
    return answerError(res, "No se pudo crear el usuario");
  }
};


// PUT /usuarios/:id
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, foto } = req.body;

  if (req.usuario.id !== id) {
    return answerError(res, "No autorizado para modificar este usuario", 403);
  }

  try {
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: { nombre, foto },
    });

    return answerOk(
      res,
      usuarioActualizado,
      "Usuario actualizado correctamente"
    );
  } catch (error) {
    console.error("actualizarUsuario: Error:", error);
    return answerError(res, "No se pudo actualizar el usuario");
  }
};

// DELETE /usuarios/:id
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  if (req.usuario.id !== id) {
    return answerError(res, "No autorizado para eliminar este usuario", 403);
  }

  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });

    return answerOk(res, usuario, "Usuario desactivado correctamente");
  } catch (error) {
    console.error("eliminarUsuario: Error:", error);
    return answerError(res, "No se pudo eliminar el usuario");
  }
};

// PUT /usuarios/:id/reactivar
const reactivarUsuario = async (req, res) => {
  const { id } = req.params;

  if (req.usuario.id !== id) {
    return answerError(res, "No autorizado para reactivar este usuario", 403);
  }

  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { activo: true },
    });

    return answerOk(res, usuario, "Usuario reactivado correctamente");
  } catch (error) {
    console.error("reactivarUsuario: Error:", error);
    return answerError(res, "No se pudo reactivar el usuario");
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  reactivarUsuario,
  obtenerUsuarioAutenticado,
};

const prisma = require("../prismaClient");

// Validación básica de correo
const esCorreoValido = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

// GET /usuarios?limit=10&page=1
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

    res.json({
      usuarios,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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
      return res.status(404).json({ error: "Usuario no encontrado o inactivo" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario autenticado:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// POST /usuarios
const crearUsuario = async (req, res) => {
  const { id, nombre, correo, foto } = req.usuario;

  try {
    const usuarioExistente = await prisma.usuario.findUnique({ where: { id } });

    if (usuarioExistente) {
      return res.status(200).json(usuarioExistente);
    }

    const nuevoUsuario = await prisma.usuario.create({
      data: { id, nombre, correo, foto },
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "No se pudo crear el usuario" });
  }
};


// PUT /usuarios/:id
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, foto } = req.body;

  if (!nombre && !foto) {
    return res
      .status(400)
      .json({ error: "Se requiere al menos un campo para actualizar" });
  }

  try {
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: { nombre, foto },
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "No se pudo actualizar el usuario" });
  }
};

// DELETE lógico /usuarios/:id
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });

    res.json({ mensaje: "Usuario desactivado correctamente", usuario });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "No se pudo eliminar el usuario" });
  }
};

// Reactivar cuenta
const reactivarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { activo: true },
    });

    res.json({ mensaje: "Usuario reactivado", usuario });
  } catch (error) {
    console.error("Error al reactivar usuario:", error);
    res.status(500).json({ error: "No se pudo reactivar el usuario" });
  }
};

module.exports = {
  obtenerUsuarios,
  esCorreoValido,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  reactivarUsuario,
  obtenerUsuarioAutenticado,
};
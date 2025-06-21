const prisma = require("../prismaClient");

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

    res.json({
      usuarios,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("obtenerUsuarios: Error:", error);
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
      return res
        .status(404)
        .json({ error: "Usuario no encontrado o inactivo" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("obtenerUsuarioAutenticado: Error:", error);
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
    console.error("crearUsuario: Error:", error);
    res.status(500).json({ error: "No se pudo crear el usuario" });
  }
};

// PUT /usuarios/:id
const actualizarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nombre, foto } = req.body;

  if (req.usuario.id !== id) {
    return res
      .status(403)
      .json({ error: "No autorizado para modificar este usuario" });
  }

  try {
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: { nombre, foto },
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error("actualizarUsuario: Error:", error);
    res.status(500).json({ error: "No se pudo actualizar el usuario" });
  }
};

// DELETE /usuarios/:id
const eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  if (req.usuario.id !== id) {
    return res
      .status(403)
      .json({ error: "No autorizado para eliminar este usuario" });
  }

  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { activo: false },
    });

    res.json({ mensaje: "Usuario desactivado correctamente", usuario });
  } catch (error) {
    console.error("eliminarUsuario: Error:", error);
    res.status(500).json({ error: "No se pudo eliminar el usuario" });
  }
};

// PUT /usuarios/:id/reactivar
const reactivarUsuario = async (req, res) => {
  const { id } = req.params;

  if (req.usuario.id !== id) {
    return res
      .status(403)
      .json({ error: "No autorizado para reactivar este usuario" });
  }

  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { activo: true },
    });

    res.json({ mensaje: "Usuario reactivado", usuario });
  } catch (error) {
    console.error("reactivarUsuario: Error:", error);
    res.status(500).json({ error: "No se pudo reactivar el usuario" });
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
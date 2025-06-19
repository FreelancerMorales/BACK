const prisma = require("../prismaClient");

// GET /usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: { creadoEn: "desc" },
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// POST /usuarios
const crearUsuario = async (req, res) => {
  const { id, nombre, correo, foto } = req.body;

  // Validaciones básicas
  if (!id || !nombre || !correo) {
    return res
      .status(400)
      .json({ error: "Faltan campos obligatorios (id, nombre, correo)" });
  }

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

module.exports = {
  obtenerUsuarios,
  crearUsuario,
};
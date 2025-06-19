const prisma = require("../prismaClient");

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// Crear nuevo usuario (por ejemplo desde login con Google)
const crearUsuario = async (req, res) => {
  const { id, nombre, correo, foto } = req.body;

  try {
    const existe = await prisma.usuario.findUnique({ where: { id } });

    if (existe) {
      return res.status(200).json(existe);
    }

    const nuevo = await prisma.usuario.create({
      data: { id, nombre, correo, foto },
    });

    res.status(201).json(nuevo);
  } catch (error) {
    res.status(400).json({ error: "No se pudo crear el usuario" });
  }
};

module.exports = {
  obtenerUsuarios,
  crearUsuario,
};
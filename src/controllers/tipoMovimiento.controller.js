const prisma = require("../prismaClient");

// Obtener todos los tipos
const obtenerTiposMovimiento = async (req, res) => {
  try {
    const tipos = await prisma.tipoMovimiento.findMany({
      orderBy: { id: "asc" },
    });
    res.json(tipos);
  } catch (error) {
    console.error("Error al obtener tipos de movimiento:", error);
    res.status(500).json({ error: "Error al obtener tipos de movimiento" });
  }
};

// Crear un nuevo tipo
const crearTipoMovimiento = async (req, res) => {
  const { nombre } = req.body;

  if (!nombre) {
    return res.status(400).json({ error: "El nombre es obligatorio" });
  }

  try {
    // Verifica si ya existe
    const existente = await prisma.tipoMovimiento.findUnique({
      where: { nombre },
    });

    if (existente) {
      return res.status(200).json(existente); // Ya existe, retornamos el existente
    }

    const nuevo = await prisma.tipoMovimiento.create({
      data: { nombre },
    });

    res.status(201).json(nuevo);
  } catch (error) {
    console.error("Error al crear tipo de movimiento:", error);
    res.status(500).json({ error: "No se pudo crear el tipo" });
  }
};

module.exports = {
  obtenerTiposMovimiento,
  crearTipoMovimiento,
};
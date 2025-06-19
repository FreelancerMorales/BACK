const prisma = require("../prismaClient");

// Obtener categorías de un usuario
const obtenerCategoriasPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const categorias = await prisma.categoria.findMany({
      where: { usuarioId },
      include: { tipoMovimiento: true },
      orderBy: { id: "desc" },
    });

    res.json(categorias);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "No se pudieron obtener las categorías" });
  }
};

// Crear una nueva categoría
const crearCategoria = async (req, res) => {
  const { nombre, tipoMovimientoId, usuarioId } = req.body;

  if (!nombre || !tipoMovimientoId || !usuarioId) {
    return res
      .status(400)
      .json({
        error:
          "Faltan campos obligatorios (nombre, tipoMovimientoId, usuarioId)",
      });
  }

  try {
    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre,
        tipoMovimientoId,
        usuarioId,
      },
    });

    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({ error: "No se pudo crear la categoría" });
  }
};

// Eliminar categoría
const eliminarCategoria = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.categoria.delete({
      where: { id: parseInt(id) },
    });

    res.json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(404).json({ error: "Categoría no encontrada" });
  }
};

module.exports = {
  obtenerCategoriasPorUsuario,
  crearCategoria,
  eliminarCategoria,
};
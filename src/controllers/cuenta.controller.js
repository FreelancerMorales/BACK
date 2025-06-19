const prisma = require("../prismaClient");

// Obtener todas las cuentas de un usuario
const obtenerCuentasPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const cuentas = await prisma.cuenta.findMany({
      where: { usuarioId },
      orderBy: { id: "desc" },
    });

    res.json(cuentas);
  } catch (error) {
    console.error("Error al obtener cuentas:", error);
    res.status(500).json({ error: "Error al obtener cuentas" });
  }
};

// Crear nueva cuenta
const crearCuenta = async (req, res) => {
  const { nombre, tipo, usuarioId } = req.body;

  if (!nombre || !tipo || !usuarioId) {
    return res
      .status(400)
      .json({ error: "Faltan campos obligatorios (nombre, tipo, usuarioId)" });
  }

  try {
    const nuevaCuenta = await prisma.cuenta.create({
      data: { nombre, tipo, usuarioId },
    });

    res.status(201).json(nuevaCuenta);
  } catch (error) {
    console.error("Error al crear cuenta:", error);
    res.status(500).json({ error: "No se pudo crear la cuenta" });
  }
};

// Eliminar cuenta (opcional)
const eliminarCuenta = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.cuenta.delete({
      where: { id: parseInt(id) },
    });

    res.json({ mensaje: "Cuenta eliminada" });
  } catch (error) {
    console.error("Error al eliminar cuenta:", error);
    res.status(404).json({ error: "Cuenta no encontrada" });
  }
};

module.exports = {
  obtenerCuentasPorUsuario,
  crearCuenta,
  eliminarCuenta,
};
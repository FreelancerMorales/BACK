const prisma = require("../prismaClient");

// Listar transacciones de un usuario
const obtenerTransaccionesPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const transacciones = await prisma.transaccion.findMany({
      where: { usuarioId },
      include: {
        cuenta: true,
        categoria: { include: { tipoMovimiento: true } },
      },
      orderBy: { fecha: "desc" },
    });
    res.json(transacciones);
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    res.status(500).json({ error: "No se pudieron obtener las transacciones" });
  }
};

// Crear nueva transacción
const crearTransaccion = async (req, res) => {
  const {
    monto,
    descripcion,
    fecha,
    cuentaId,
    categoriaId,
    tipoMovimientoId,
    usuarioId,
  } = req.body;

  // Validaciones básicas
  if (
    monto == null ||
    !cuentaId ||
    !categoriaId ||
    !tipoMovimientoId ||
    !usuarioId
  ) {
    return res
      .status(400)
      .json({
        error:
          "Faltan campos obligatorios: monto, cuentaId, categoriaId, tipoMovimientoId, usuarioId",
      });
  }

  try {
    // Crear transacción
    const nueva = await prisma.transaccion.create({
      data: {
        monto,
        descripcion,
        fecha: fecha ? new Date(fecha) : undefined,
        cuentaId: parseInt(cuentaId),
        categoriaId: parseInt(categoriaId),
        tipoMovimientoId: parseInt(tipoMovimientoId),
        usuarioId,
      },
    });
    res.status(201).json(nueva);
  } catch (error) {
    console.error("Error al crear transacción:", error);
    res.status(500).json({ error: "No se pudo crear la transacción " });
  }
};

// Eliminar transacción
const eliminarTransaccion = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.transaccion.delete({ where: { id: parseInt(id) } });
    res.json({ mensaje: "Transacción eliminada" });
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    res.status(404).json({ error: "Transacción no encontrada" });
  }
};

module.exports = {
  obtenerTransaccionesPorUsuario,
  crearTransaccion,
  eliminarTransaccion,
};

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TipoMovimientoService {
  // Obtener todos los tipos de movimiento activos
  async obtenerTodos() {
    return await prisma.tipomovimiento.findMany({
      where: { activo: true },
      orderBy: { nombre: "asc" },
    });
  }

  // Obtener tipo de movimiento por ID
  async obtenerPorId(id) {
    return await prisma.tipomovimiento.findUnique({
      where: { id: parseInt(id) },
    });
  }

  // Crear nuevo tipo de movimiento (solo admin)
  async crear(datos) {
    const existeNombre = await prisma.tipomovimiento.findUnique({
      where: { nombre: datos.nombre },
    });

    if (existeNombre) {
      throw new Error("Ya existe un tipo de movimiento con ese nombre");
    }

    return await prisma.tipomovimiento.create({
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        transferencia: datos.transferencia ?? false,
        activo: datos.activo ?? true,
      },
    });
  }

  // Actualizar tipo de movimiento
  async actualizar(id, datos) {
    const tipoMovimiento = await prisma.tipomovimiento.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tipoMovimiento) {
      throw new Error("Tipo de movimiento no encontrado");
    }

    // Verificar nombre único si se está actualizando
    if (datos.nombre && datos.nombre !== tipoMovimiento.nombre) {
      const existeNombre = await prisma.tipomovimiento.findUnique({
        where: { nombre: datos.nombre },
      });

      if (existeNombre) {
        throw new Error("Ya existe un tipo de movimiento con ese nombre");
      }
    }

    return await prisma.tipomovimiento.update({
      where: { id: parseInt(id) },
      data: {
        ...(datos.nombre !== undefined && { nombre: datos.nombre }),
        ...(datos.descripcion !== undefined && {
          descripcion: datos.descripcion,
        }),
        ...(datos.transferencia !== undefined && {
          transferencia: datos.transferencia,
        }),
        ...(datos.activo !== undefined && { activo: datos.activo }),
      },
    });
  }

  // Eliminar tipo de movimiento (soft delete)
  async eliminar(id) {
    const tipoMovimiento = await prisma.tipomovimiento.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tipoMovimiento) {
      throw new Error("Tipo de movimiento no encontrado");
    }

    // Verificar si tiene transacciones asociadas
    const tieneTransacciones = await prisma.transaccion.findFirst({
      where: { tipoMovimientoId: parseInt(id) },
    });

    if (tieneTransacciones) {
      // Solo desactivar si tiene transacciones
      return await prisma.tipomovimiento.update({
        where: { id: parseInt(id) },
        data: { activo: false },
      });
    } else {
      // Eliminar físicamente si no tiene transacciones
      return await prisma.tipomovimiento.delete({
        where: { id: parseInt(id) },
      });
    }
  }

  // Reactivar tipo de movimiento (restore soft delete)
  async reactivar(id) {
    const tipoMovimiento = await prisma.tipomovimiento.findUnique({
      where: { id: parseInt(id) },
    });

    if (!tipoMovimiento) {
      throw new Error("Tipo de movimiento no encontrado");
    }

    if (tipoMovimiento.activo) {
      throw new Error("El tipo de movimiento ya está activo");
    }

    return await prisma.tipomovimiento.update({
      where: { id: parseInt(id) },
      data: { activo: true },
    });
  }

  // Obtener estadísticas de uso
  async obtenerEstadisticas() {
    const estadisticas = await prisma.tipomovimiento.findMany({
      include: {
        _count: {
          select: {
            transaccion: true,
            proyeccion: true,
            categoriabase: true,
          },
        },
      },
      orderBy: { nombre: "asc" },
    });

    return estadisticas.map((tipo) => ({
      id: tipo.id,
      nombre: tipo.nombre,
      descripcion: tipo.descripcion,
      transferencia: tipo.transferencia,
      activo: tipo.activo,
      totalTransacciones: tipo._count.transaccion,
      totalProyecciones: tipo._count.proyeccion,
      totalCategorias: tipo._count.categoriabase,
    }));
  }
}

module.exports = new TipoMovimientoService();

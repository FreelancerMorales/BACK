const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class EtiquetaService {
  // Crear nueva etiqueta
  async crear(datos) {
    const etiquetaExistente = await prisma.etiqueta.findFirst({
      where: {
        usuarioId: datos.usuarioId,
        nombre: datos.nombre,
      },
    });

    if (etiquetaExistente) {
      throw new Error("Ya existe una etiqueta con este nombre");
    }

    return await prisma.etiqueta.create({
      data: {
        nombre: datos.nombre,
        color: datos.color,
        descripcion: datos.descripcion,
        usuarioId: datos.usuarioId,
        activo: datos.activo ?? true,
      },
    });
  }

  // Obtener todas las etiquetas de un usuario
  async obtenerPorUsuario(usuarioId, opciones = {}) {
    const { activo } = opciones;

    const where = {
      usuarioId,
      ...(activo !== undefined && { activo }),
    };

    return await prisma.etiqueta.findMany({
      where,
      orderBy: [{ nombre: "asc" }],
    });
  }

  // Obtener etiqueta por ID
  async obtenerPorId(id, usuarioId) {
    return await prisma.etiqueta.findFirst({
      where: {
        id: parseInt(id),
        usuarioId,
      },
    });
  }

  // Actualizar etiqueta
  async actualizar(id, datos, usuarioId) {
    const etiqueta = await prisma.etiqueta.findFirst({
      where: { id: parseInt(id), usuarioId },
    });

    if (!etiqueta) {
      throw new Error("Etiqueta no encontrada");
    }

    // Verificar nombre único si se está actualizando
    if (datos.nombre && datos.nombre !== etiqueta.nombre) {
      const etiquetaExistente = await prisma.etiqueta.findFirst({
        where: {
          usuarioId,
          nombre: datos.nombre,
        },
      });

      if (etiquetaExistente) {
        throw new Error("Ya existe una etiqueta con este nombre");
      }
    }

    return await prisma.etiqueta.update({
      where: {
        id: parseInt(id),
        usuarioId,
      },
      data: {
        ...(datos.nombre !== undefined && { nombre: datos.nombre }),
        ...(datos.color !== undefined && { color: datos.color }),
        ...(datos.descripcion !== undefined && { descripcion: datos.descripcion }),
        ...(datos.activo !== undefined && { activo: datos.activo }),
      },
    });
  }

  // Eliminar etiqueta
  async eliminar(id, usuarioId) {
    const etiqueta = await prisma.etiqueta.findFirst({
      where: { id: parseInt(id), usuarioId },
    });

    if (!etiqueta) {
      throw new Error("Etiqueta no encontrada");
    }

    // Verificar si tiene transacciones asociadas
    const transaccionesAsociadas = await prisma.etiquetaontransaccion.count({
      where: { etiquetaId: parseInt(id) },
    });

    if (transaccionesAsociadas > 0) {
      throw new Error("No se puede eliminar la etiqueta porque tiene transacciones asociadas");
    }

    return await prisma.etiqueta.delete({
      where: {
        id: parseInt(id),
        usuarioId,
      },
    });
  }

  // Obtener etiquetas con conteo de transacciones
  async obtenerConEstadisticas(usuarioId) {
    return await prisma.etiqueta.findMany({
      where: { usuarioId, activo: true },
      include: {
        _count: {
          select: {
            etiquetaontransaccion: true,
          },
        },
      },
      orderBy: [{ nombre: "asc" }],
    });
  }

  // Obtener transacciones de una etiqueta
  async obtenerTransacciones(id, usuarioId, opciones = {}) {
    const etiqueta = await this.obtenerPorId(id, usuarioId);
    if (!etiqueta) {
      throw new Error("Etiqueta no encontrada");
    }

    const { limite = 50, pagina = 1, fechaInicio, fechaFin } = opciones;

    const where = {
      etiquetaontransaccion: {
        some: {
          etiquetaId: parseInt(id),
        },
      },
      usuarioId,
      ...(fechaInicio && fechaFin && {
        fecha: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        },
      }),
    };

    const transacciones = await prisma.transaccion.findMany({
      where,
      include: {
        cuenta: true,
        tipomovimiento: true,
        tipopago: true,
        usuariocategoria: {
          include: {
            categoriabase: {
              include: {
                icono: true,
                color: true,
              },
            },
          },
        },
      },
      orderBy: [{ fecha: "desc" }, { creadoEn: "desc" }],
      take: limite,
      skip: (pagina - 1) * limite,
    });

    const total = await prisma.transaccion.count({ where });

    return {
      etiqueta,
      transacciones,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }
}

module.exports = new EtiquetaService();
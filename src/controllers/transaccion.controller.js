const prisma = require("../prismaClient");
const { answerOk, answerError } = require("../utils/answers");

// GET /transacciones
const obtenerTransacciones = async (req, res) => {
  const {
    limit,
    page,
    cuentaId,
    categoriaId,
    tipoMovimientoId,
    fechaInicio,
    fechaFin,
  } = req.query;
  const limitNum = parseInt(limit) || 50;
  const pageNum = parseInt(page) || 1;
  const skip = (pageNum - 1) * limitNum;

  try {
    // Construir filtros
    const where = {
      usuarioId: req.usuario.id,
    };

    if (cuentaId) where.cuentaId = parseInt(cuentaId);
    if (categoriaId) where.categoriaId = parseInt(categoriaId);
    if (tipoMovimientoId) where.tipoMovimientoId = parseInt(tipoMovimientoId);

    // Filtros de fecha
    if (fechaInicio || fechaFin) {
      where.fecha = {};
      if (fechaInicio) where.fecha.gte = new Date(fechaInicio);
      if (fechaFin) where.fecha.lte = new Date(fechaFin);
    }

    const transacciones = await prisma.transaccion.findMany({
      where,
      orderBy: { fecha: "desc" },
      skip,
      take: limitNum,
      include: {
        cuenta: {
          select: { id: true, nombre: true, tipo: true, color: true },
        },
        categoria: {
          select: { id: true, nombre: true, icono: true, color: true },
        },
        tipoMovimiento: {
          select: { id: true, nombre: true },
        },
        tipoPago: {
          select: { id: true, nombre: true },
        },
        plantilla: {
          select: { id: true, nombre: true },
        },
        etiquetas: {
          include: {
            etiqueta: {
              select: { id: true, nombre: true, color: true },
            },
          },
        },
      },
    });

    const total = await prisma.transaccion.count({ where });

    // Formatear respuesta
    const transaccionesFormateadas = transacciones.map((transaccion) => ({
      ...transaccion,
      etiquetas: transaccion.etiquetas.map((et) => et.etiqueta),
    }));

    return answerOk(
      res,
      {
        transacciones: transaccionesFormateadas,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
      "Transacciones obtenidas correctamente"
    );
  } catch (error) {
    console.error(
      `obtenerTransacciones: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener las transacciones");
  }
};

// GET /transacciones/:id
const obtenerTransaccionPorId = async (req, res) => {
  const transaccionId = parseInt(req.params.id);

  if (isNaN(transaccionId)) {
    return answerError(res, "ID de transacción inválido", 400);
  }

  try {
    const transaccion = await prisma.transaccion.findFirst({
      where: {
        id: transaccionId,
        usuarioId: req.usuario.id,
      },
      include: {
        cuenta: {
          select: { id: true, nombre: true, tipo: true, color: true },
        },
        categoria: {
          select: { id: true, nombre: true, icono: true, color: true },
        },
        tipoMovimiento: {
          select: { id: true, nombre: true },
        },
        tipoPago: {
          select: { id: true, nombre: true },
        },
        plantilla: {
          select: { id: true, nombre: true },
        },
        etiquetas: {
          include: {
            etiqueta: {
              select: { id: true, nombre: true, color: true },
            },
          },
        },
      },
    });

    if (!transaccion) {
      return answerError(res, "Transacción no encontrada", 404);
    }

    // Formatear etiquetas
    const transaccionFormateada = {
      ...transaccion,
      etiquetas: transaccion.etiquetas.map((et) => et.etiqueta),
    };

    return answerOk(
      res,
      transaccionFormateada,
      "Transacción obtenida correctamente"
    );
  } catch (error) {
    console.error(
      `obtenerTransaccionPorId: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener la transacción");
  }
};

// POST /transacciones
const crearTransaccion = async (req, res) => {
  const {
    monto,
    descripcion,
    fecha,
    cuentaId,
    categoriaId,
    tipoMovimientoId,
    tipoPagoId,
    plantillaId,
    etiquetaIds = [],
  } = req.body;

  try {
    // Verificar que la cuenta pertenece al usuario
    const cuenta = await prisma.cuenta.findFirst({
      where: {
        id: cuentaId,
        usuarioId: req.usuario.id,
        activo: true,
      },
    });

    if (!cuenta) {
      return answerError(res, "Cuenta no encontrada o inactiva", 404);
    }

    // Verificar que la categoría pertenece al usuario
    const categoria = await prisma.categoria.findFirst({
      where: {
        id: categoriaId,
        usuarioId: req.usuario.id,
      },
    });

    if (!categoria) {
      return answerError(res, "Categoría no encontrada", 404);
    }

    // Verificar que el tipo de movimiento existe
    const tipoMovimiento = await prisma.tipoMovimiento.findUnique({
      where: { id: tipoMovimientoId },
    });

    if (!tipoMovimiento) {
      return answerError(res, "Tipo de movimiento no encontrado", 404);
    }

    // Verificar que el tipo de pago existe (si se proporciona)
    if (tipoPagoId) {
      const tipoPago = await prisma.tipoPago.findFirst({
        where: { id: tipoPagoId, activo: true },
      });

      if (!tipoPago) {
        return answerError(res, "Tipo de pago no encontrado o inactivo", 404);
      }
    }

    // Verificar etiquetas (si se proporcionan)
    if (etiquetaIds.length > 0) {
      const etiquetas = await prisma.etiqueta.findMany({
        where: {
          id: { in: etiquetaIds },
          usuarioId: req.usuario.id,
        },
      });

      if (etiquetas.length !== etiquetaIds.length) {
        return answerError(res, "Una o más etiquetas no son válidas", 400);
      }
    }

    // Crear transacción
    const nuevaTransaccion = await prisma.transaccion.create({
      data: {
        monto: parseFloat(monto),
        descripcion,
        fecha: fecha ? new Date(fecha) : new Date(),
        cuentaId,
        categoriaId,
        tipoMovimientoId,
        tipoPagoId,
        plantillaId,
        usuarioId: req.usuario.id,
        etiquetas: {
          create: etiquetaIds.map((etiquetaId) => ({
            etiquetaId,
          })),
        },
      },
      include: {
        cuenta: {
          select: { id: true, nombre: true, tipo: true, color: true },
        },
        categoria: {
          select: { id: true, nombre: true, icono: true, color: true },
        },
        tipoMovimiento: {
          select: { id: true, nombre: true },
        },
        tipoPago: {
          select: { id: true, nombre: true },
        },
        plantilla: {
          select: { id: true, nombre: true },
        },
        etiquetas: {
          include: {
            etiqueta: {
              select: { id: true, nombre: true, color: true },
            },
          },
        },
      },
    });

    // Formatear respuesta
    const transaccionFormateada = {
      ...nuevaTransaccion,
      etiquetas: nuevaTransaccion.etiquetas.map((et) => et.etiqueta),
    };

    return answerOk(
      res,
      transaccionFormateada,
      "Transacción creada correctamente",
      201
    );
  } catch (error) {
    console.error(
      `crearTransaccion: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo crear la transacción");
  }
};

// PUT /transacciones/:id
const actualizarTransaccion = async (req, res) => {
  const transaccionId = parseInt(req.params.id);
  const {
    monto,
    descripcion,
    fecha,
    cuentaId,
    categoriaId,
    tipoMovimientoId,
    tipoPagoId,
    etiquetaIds,
  } = req.body;

  if (isNaN(transaccionId)) {
    return answerError(res, "ID de transacción inválido", 400);
  }

  try {
    // Verificar que la transacción existe y pertenece al usuario
    const transaccionExistente = await prisma.transaccion.findFirst({
      where: {
        id: transaccionId,
        usuarioId: req.usuario.id,
      },
    });

    if (!transaccionExistente) {
      return answerError(res, "Transacción no encontrada", 404);
    }

    // Verificaciones similares a crearTransaccion (solo para campos que se actualizan)
    if (cuentaId) {
      const cuenta = await prisma.cuenta.findFirst({
        where: {
          id: cuentaId,
          usuarioId: req.usuario.id,
          activo: true,
        },
      });

      if (!cuenta) {
        return answerError(res, "Cuenta no encontrada o inactiva", 404);
      }
    }

    if (categoriaId) {
      const categoria = await prisma.categoria.findFirst({
        where: {
          id: categoriaId,
          usuarioId: req.usuario.id,
        },
      });

      if (!categoria) {
        return answerError(res, "Categoría no encontrada", 404);
      }
    }

    // Preparar datos para actualización
    const datosActualizacion = {};
    if (monto !== undefined) datosActualizacion.monto = parseFloat(monto);
    if (descripcion !== undefined) datosActualizacion.descripcion = descripcion;
    if (fecha !== undefined) datosActualizacion.fecha = new Date(fecha);
    if (cuentaId !== undefined) datosActualizacion.cuentaId = cuentaId;
    if (categoriaId !== undefined) datosActualizacion.categoriaId = categoriaId;
    if (tipoMovimientoId !== undefined)
      datosActualizacion.tipoMovimientoId = tipoMovimientoId;
    if (tipoPagoId !== undefined) datosActualizacion.tipoPagoId = tipoPagoId;

    // Actualizar transacción
    const transaccionActualizada = await prisma.transaccion.update({
      where: { id: transaccionId },
      data: datosActualizacion,
      include: {
        cuenta: {
          select: { id: true, nombre: true, tipo: true, color: true },
        },
        categoria: {
          select: { id: true, nombre: true, icono: true, color: true },
        },
        tipoMovimiento: {
          select: { id: true, nombre: true },
        },
        tipoPago: {
          select: { id: true, nombre: true },
        },
        etiquetas: {
          include: {
            etiqueta: {
              select: { id: true, nombre: true, color: true },
            },
          },
        },
      },
    });

    // Actualizar etiquetas si se proporcionan
    if (etiquetaIds !== undefined) {
      // Eliminar etiquetas actuales
      await prisma.etiquetaOnTransaccion.deleteMany({
        where: { transaccionId },
      });

      // Agregar nuevas etiquetas
      if (etiquetaIds.length > 0) {
        await prisma.etiquetaOnTransaccion.createMany({
          data: etiquetaIds.map((etiquetaId) => ({
            transaccionId,
            etiquetaId,
          })),
        });
      }

      // Obtener transacción actualizada con etiquetas
      const transaccionConEtiquetas = await prisma.transaccion.findUnique({
        where: { id: transaccionId },
        include: {
          etiquetas: {
            include: {
              etiqueta: {
                select: { id: true, nombre: true, color: true },
              },
            },
          },
        },
      });

      transaccionActualizada.etiquetas = transaccionConEtiquetas.etiquetas;
    }

    // Formatear respuesta
    const transaccionFormateada = {
      ...transaccionActualizada,
      etiquetas: transaccionActualizada.etiquetas.map((et) => et.etiqueta),
    };

    return answerOk(
      res,
      transaccionFormateada,
      "Transacción actualizada correctamente"
    );
  } catch (error) {
    console.error(
      `actualizarTransaccion: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo actualizar la transacción");
  }
};

// DELETE /transacciones/:id
const eliminarTransaccion = async (req, res) => {
  const transaccionId = parseInt(req.params.id);

  if (isNaN(transaccionId)) {
    return answerError(res, "ID de transacción inválido", 400);
  }

  try {
    const transaccion = await prisma.transaccion.findFirst({
      where: {
        id: transaccionId,
        usuarioId: req.usuario.id,
      },
    });

    if (!transaccion) {
      return answerError(res, "Transacción no encontrada", 404);
    }

    // Eliminar etiquetas asociadas primero
    await prisma.etiquetaOnTransaccion.deleteMany({
      where: { transaccionId },
    });

    // Eliminar transacción
    await prisma.transaccion.delete({
      where: { id: transaccionId },
    });

    return answerOk(
      res,
      { id: transaccionId },
      "Transacción eliminada correctamente"
    );
  } catch (error) {
    console.error(
      `eliminarTransaccion: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo eliminar la transacción");
  }
};

// GET /transacciones/estadisticas
const obtenerEstadisticasTransacciones = async (req, res) => {
  const { fechaInicio, fechaFin, cuentaId, categoriaId } = req.query;

  try {
    // Construir filtros
    const where = {
      usuarioId: req.usuario.id,
    };

    if (cuentaId) where.cuentaId = parseInt(cuentaId);
    if (categoriaId) where.categoriaId = parseInt(categoriaId);

    // Filtros de fecha
    if (fechaInicio || fechaFin) {
      where.fecha = {};
      if (fechaInicio) where.fecha.gte = new Date(fechaInicio);
      if (fechaFin) where.fecha.lte = new Date(fechaFin);
    }

    // Estadísticas generales
    const estadisticasGenerales = await prisma.transaccion.aggregate({
      where,
      _sum: { monto: true },
      _count: { id: true },
      _avg: { monto: true },
    });

    // Estadísticas por tipo de movimiento
    const estadisticasPorTipo = await prisma.transaccion.groupBy({
      by: ["tipoMovimientoId"],
      where,
      _sum: { monto: true },
      _count: { id: true },
    });

    // Obtener nombres de tipos de movimiento
    const tiposMovimiento = await prisma.tipoMovimiento.findMany({
      where: { id: { in: estadisticasPorTipo.map((e) => e.tipoMovimientoId) } },
      select: { id: true, nombre: true },
    });

    const tipoMovimientoMap = Object.fromEntries(
      tiposMovimiento.map((tipo) => [tipo.id, tipo.nombre])
    );

    const estadisticasFormateadas = {
      general: {
        totalMonto: parseFloat(
          (estadisticasGenerales._sum.monto || 0).toFixed(2)
        ),
        totalTransacciones: estadisticasGenerales._count.id,
        promedioMonto: parseFloat(
          (estadisticasGenerales._avg.monto || 0).toFixed(2)
        ),
      },
      porTipo: estadisticasPorTipo.map((stat) => ({
        tipoMovimiento: tipoMovimientoMap[stat.tipoMovimientoId],
        totalMonto: parseFloat((stat._sum.monto || 0).toFixed(2)),
        totalTransacciones: stat._count.id,
      })),
    };

    return answerOk(
      res,
      estadisticasFormateadas,
      "Estadísticas obtenidas correctamente"
    );
  } catch (error) {
    console.error(
      `obtenerEstadisticasTransacciones: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener las estadísticas");
  }
};

module.exports = {
  obtenerTransacciones,
  obtenerTransaccionPorId,
  crearTransaccion,
  actualizarTransaccion,
  eliminarTransaccion,
  obtenerEstadisticasTransacciones,
};
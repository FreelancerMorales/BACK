const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ProyeccionService {
  // Crear nueva proyección
  async crear(datos) {
    const [existeCategoria, existeCuenta, existeTipoMovimiento] =
      await Promise.all([
        prisma.usuariocategoria.findFirst({
          where: { id: datos.usuarioCategoriaId, usuarioId: datos.usuarioId },
        }),
        prisma.cuenta.findFirst({
          where: { id: datos.cuentaId, usuarioId: datos.usuarioId },
        }),
        prisma.tipomovimiento.findUnique({
          where: { id: datos.tipoMovimientoId },
        }),
      ]);

    if (!existeCategoria)
      throw new Error(
        "La categoría seleccionada no existe o no pertenece al usuario"
      );
    if (!existeCuenta)
      throw new Error(
        "La cuenta seleccionada no existe o no pertenece al usuario"
      );
    if (!existeTipoMovimiento)
      throw new Error("El tipo de movimiento seleccionado no existe");

    if (datos.tipoPagoId) {
      const existeTipoPago = await prisma.tipopago.findUnique({
        where: { id: datos.tipoPagoId },
      });
      if (!existeTipoPago)
        throw new Error("El tipo de pago seleccionado no existe");
    }

    return await prisma.proyeccion.create({
      data: {
        fecha: datos.fecha || new Date(),
        monto: datos.monto,
        descripcion: datos.descripcion,
        titulo: datos.titulo,
        cuentaId: datos.cuentaId,
        tipoMovimientoId: datos.tipoMovimientoId,
        tipoPagoId: datos.tipoPagoId,
        usuarioId: datos.usuarioId,
        usuarioCategoriaId: datos.usuarioCategoriaId,
        recurrente: datos.recurrente || false,
        frecuencia: datos.frecuencia,
        proximaFecha: datos.proximaFecha,
        fechaVencimiento: datos.fechaVencimiento,
        notificar: datos.notificar ?? true,
        diasNotificacion: datos.diasNotificacion || 1,
        estado: datos.estado || "PENDIENTE",
        actualizadoEn: new Date(),
      },
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
    });
  }

  // Obtener todas las proyecciones de un usuario
  async obtenerPorUsuario(usuarioId, opciones = {}) {
    const {
      limite = 50,
      pagina = 1,
      fechaInicio,
      fechaFin,
      cuentaId,
      tipoMovimientoId,
      estado,
      recurrente,
    } = opciones;

    const where = {
      usuarioId,
      ...(fechaInicio &&
        fechaFin && {
          fecha: {
            gte: new Date(fechaInicio),
            lte: new Date(fechaFin),
          },
        }),
      ...(cuentaId && { cuentaId }),
      ...(tipoMovimientoId && { tipoMovimientoId }),
      ...(estado && { estado }),
      ...(recurrente !== undefined && { recurrente }),
    };

    const proyecciones = await prisma.proyeccion.findMany({
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
      orderBy: [{ fecha: "asc" }, { creadoEn: "desc" }],
      take: limite,
      skip: (pagina - 1) * limite,
    });

    const total = await prisma.proyeccion.count({ where });

    return {
      proyecciones,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  // Obtener proyección por ID
  async obtenerPorId(id, usuarioId) {
    return await prisma.proyeccion.findFirst({
      where: {
        id: parseInt(id),
        usuarioId,
      },
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
    });
  }

  // Actualizar proyección
  async actualizar(id, datos, usuarioId) {
    const proyeccion = await prisma.proyeccion.findFirst({
      where: { id: parseInt(id), usuarioId },
    });
    if (!proyeccion) throw new Error("Proyección no encontrada");

    // Validar cuenta si se actualiza
    if (datos.cuentaId) {
      const cuenta = await prisma.cuenta.findFirst({
        where: { id: datos.cuentaId, usuarioId },
      });
      if (!cuenta)
        throw new Error(
          "La cuenta seleccionada no existe o no pertenece al usuario"
        );
    }

    // Validar categoría si se actualiza
    if (datos.usuarioCategoriaId) {
      const categoria = await prisma.usuariocategoria.findFirst({
        where: { id: datos.usuarioCategoriaId, usuarioId },
      });
      if (!categoria)
        throw new Error(
          "La categoría seleccionada no existe o no pertenece al usuario"
        );
    }

    // Validar tipo de movimiento si se actualiza
    if (datos.tipoMovimientoId) {
      const tipoMovimiento = await prisma.tipomovimiento.findUnique({
        where: { id: datos.tipoMovimientoId },
      });
      if (!tipoMovimiento)
        throw new Error("El tipo de movimiento seleccionado no existe");
    }

    // Validar tipo de pago si se actualiza
    if (datos.tipoPagoId) {
      const tipoPago = await prisma.tipopago.findUnique({
        where: { id: datos.tipoPagoId },
      });
      if (!tipoPago) throw new Error("El tipo de pago seleccionado no existe");
    }

    return await prisma.proyeccion.update({
      where: { id: parseInt(id), usuarioId },
      data: {
        ...(datos.fecha !== undefined && { fecha: new Date(datos.fecha) }),
        ...(datos.monto !== undefined && { monto: datos.monto }),
        ...(datos.descripcion !== undefined && {
          descripcion: datos.descripcion,
        }),
        ...(datos.titulo !== undefined && { titulo: datos.titulo }),
        ...(datos.cuentaId !== undefined && { cuentaId: datos.cuentaId }),
        ...(datos.tipoMovimientoId !== undefined && {
          tipoMovimientoId: datos.tipoMovimientoId,
        }),
        ...(datos.tipoPagoId !== undefined && { tipoPagoId: datos.tipoPagoId }),
        ...(datos.usuarioCategoriaId !== undefined && {
          usuarioCategoriaId: datos.usuarioCategoriaId,
        }),
        ...(datos.recurrente !== undefined && { recurrente: datos.recurrente }),
        ...(datos.frecuencia !== undefined && { frecuencia: datos.frecuencia }),
        ...(datos.proximaFecha !== undefined && {
          proximaFecha: datos.proximaFecha
            ? new Date(datos.proximaFecha)
            : null,
        }),
        ...(datos.fechaVencimiento !== undefined && {
          fechaVencimiento: datos.fechaVencimiento
            ? new Date(datos.fechaVencimiento)
            : null,
        }),
        ...(datos.notificar !== undefined && { notificar: datos.notificar }),
        ...(datos.diasNotificacion !== undefined && {
          diasNotificacion: datos.diasNotificacion,
        }),
        ...(datos.estado !== undefined && { estado: datos.estado }),
        actualizadoEn: new Date(),
      },
      include: {
        cuenta: true,
        tipomovimiento: true,
        tipopago: true,
        usuariocategoria: {
          include: {
            categoriabase: {
              include: { icono: true, color: true },
            },
          },
        },
      },
    });
  }

  // Eliminar proyección
  async eliminar(id, usuarioId) {
    const proyeccion = await prisma.proyeccion.findFirst({
      where: { id: parseInt(id), usuarioId },
    });
    if (!proyeccion) throw new Error("Proyección no encontrada");

    await prisma.proyeccion.delete({
      where: { id: parseInt(id), usuarioId },
    });
  }

  // Cambiar estado de proyección
  async cambiarEstado(id, estado, usuarioId) {
    const proyeccion = await prisma.proyeccion.findFirst({
      where: { id: parseInt(id), usuarioId },
    });
    if (!proyeccion) throw new Error("Proyección no encontrada");

    return await this.actualizar(id, { estado }, usuarioId);
  }

  // Obtener proyecciones por cuenta
  async obtenerPorCuenta(cuentaId, usuarioId, opciones = {}) {
    const cuenta = await prisma.cuenta.findFirst({
      where: { id: cuentaId, usuarioId },
    });
    if (!cuenta)
      throw new Error(
        "La cuenta seleccionada no existe o no pertenece al usuario"
      );

    return await this.obtenerPorUsuario(usuarioId, {
      ...opciones,
      cuentaId,
    });
  }

  // Obtener proyecciones próximas a vencer
  async obtenerProximasVencer(usuarioId, dias = 7) {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + dias);

    return await prisma.proyeccion.findMany({
      where: {
        usuarioId,
        estado: "PENDIENTE",
        notificar: true,
        OR: [
          {
            fecha: {
              lte: fechaLimite,
            },
          },
          {
            fechaVencimiento: {
              lte: fechaLimite,
            },
          },
        ],
      },
      include: {
        cuenta: true,
        tipomovimiento: true,
        tipopago: true,
        usuariocategoria: {
          include: {
            categoriabase: {
              include: { icono: true, color: true },
            },
          },
        },
      },
      orderBy: [{ fecha: "asc" }],
    });
  }

  // Obtener proyecciones recurrentes
  async obtenerRecurrentes(usuarioId) {
    return await prisma.proyeccion.findMany({
      where: {
        usuarioId,
        recurrente: true,
        estado: "PENDIENTE",
      },
      include: {
        cuenta: true,
        tipomovimiento: true,
        tipopago: true,
        usuariocategoria: {
          include: {
            categoriabase: {
              include: { icono: true, color: true },
            },
          },
        },
      },
      orderBy: [{ proximaFecha: "asc" }],
    });
  }
}

module.exports = new ProyeccionService();

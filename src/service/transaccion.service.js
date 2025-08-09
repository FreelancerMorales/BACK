const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TransaccionService {
  // Crear nueva transacción
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

    // Ejecuta todo en una transacción de base de datos
    return await prisma.$transaction(async (tx) => {
      // Obtén la cuenta actualizada
      const cuenta = await tx.cuenta.findFirst({
        where: { id: datos.cuentaId, usuarioId: datos.usuarioId },
      });

      if (!cuenta) throw new Error("Cuenta no encontrada");

      // Obtén el tipo de movimiento
      const tipoMovimiento = await tx.tipomovimiento.findUnique({
        where: { id: datos.tipoMovimientoId },
      });

      if (!tipoMovimiento) throw new Error("Tipo de movimiento no encontrado");

      // Calcula el nuevo saldo
      let saldoActual = Number(cuenta.saldoActual); // Asegura que es número
      let monto = Number(datos.monto);

      let nuevoSaldo = saldoActual;
      if (tipoMovimiento.transferencia) {
        // Lógica especial si aplica
      } else if (tipoMovimiento.nombre.toLowerCase() === "ingreso") {
        nuevoSaldo = saldoActual + monto;
      } else {
        nuevoSaldo = saldoActual - monto;
        if (nuevoSaldo < 0) {
          throw new Error("Saldo insuficiente en la cuenta");
        }
      }

      // Actualiza el saldo de la cuenta
      await tx.cuenta.update({
        where: { id: cuenta.id },
        data: { saldoActual: nuevoSaldo, actualizadoEn: new Date() },
      });

      // Crea la transacción
      const transaccion = await tx.transaccion.create({
        data: {
          monto: datos.monto,
          descripcion: datos.descripcion,
          fecha: datos.fecha || new Date(),
          cuentaId: datos.cuentaId,
          tipoMovimientoId: datos.tipoMovimientoId,
          usuarioId: datos.usuarioId,
          tipoPagoId: datos.tipoPagoId,
          usuarioCategoriaId: datos.usuarioCategoriaId,
          confirmada: datos.confirmada ?? true,
          notas: datos.notas,
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
          etiquetaontransaccion: {
            include: {
              etiqueta: true,
            },
          },
        },
      });

      return transaccion;
    });
  }

  // Obtener todas las transacciones de un usuario
  async obtenerPorUsuario(usuarioId, opciones = {}) {
    const {
      limite = 50,
      pagina = 1,
      fechaInicio,
      fechaFin,
      cuentaId,
      tipoMovimientoId,
      confirmada,
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
      ...(confirmada !== undefined && { confirmada }),
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
        etiquetaontransaccion: {
          include: {
            etiqueta: true,
          },
        },
      },
      orderBy: [{ fecha: "desc" }, { creadoEn: "desc" }],
      take: limite,
      skip: (pagina - 1) * limite,
    });

    const total = await prisma.transaccion.count({ where });

    return {
      transacciones,
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    };
  }

  // Obtener transacción por ID
  async obtenerPorId(id, usuarioId) {
    return await prisma.transaccion.findFirst({
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
        etiquetaontransaccion: {
          include: {
            etiqueta: true,
          },
        },
      },
    });
  }

  // Actualizar transacción
  async actualizar(id, datos, usuarioId) {
    const transaccion = await prisma.transaccion.findFirst({
      where: { id: parseInt(id), usuarioId },
    });
    if (!transaccion) throw new Error("Transacción no encontrada");

    // Si se actualiza cuentaId
    if (datos.cuentaId) {
      const cuenta = await prisma.cuenta.findFirst({
        where: { id: datos.cuentaId, usuarioId },
      });
      if (!cuenta)
        throw new Error(
          "La cuenta seleccionada no existe o no pertenece al usuario"
        );
    }

    // Si se actualiza usuarioCategoriaId
    if (datos.usuarioCategoriaId) {
      const categoria = await prisma.usuariocategoria.findFirst({
        where: { id: datos.usuarioCategoriaId, usuarioId },
      });
      if (!categoria)
        throw new Error(
          "La categoría seleccionada no existe o no pertenece al usuario"
        );
    }

    // Si se actualiza tipoMovimientoId
    if (datos.tipoMovimientoId) {
      const tipoMovimiento = await prisma.tipomovimiento.findUnique({
        where: { id: datos.tipoMovimientoId },
      });
      if (!tipoMovimiento)
        throw new Error("El tipo de movimiento seleccionado no existe");
    }

    // Si se actualiza tipoPagoId
    if (datos.tipoPagoId) {
      const tipoPago = await prisma.tipopago.findUnique({
        where: { id: datos.tipoPagoId },
      });
      if (!tipoPago) throw new Error("El tipo de pago seleccionado no existe");
    }

    return await prisma.$transaction(async (tx) => {
      // 1. Revertir saldo de la cuenta original
      const cuentaOriginal = await tx.cuenta.findUnique({
        where: { id: transaccion.cuentaId },
      });
      const tipoMovimientoOriginal = await tx.tipomovimiento.findUnique({
        where: { id: transaccion.tipoMovimientoId },
      });

      let saldoOriginal = Number(cuentaOriginal.saldoActual);
      let montoOriginal = Number(transaccion.monto);

      if (tipoMovimientoOriginal.transferencia) {
        // lógica especial si aplica
      } else if (tipoMovimientoOriginal.nombre.toLowerCase() === "ingreso") {
        saldoOriginal -= montoOriginal;
      } else {
        saldoOriginal += montoOriginal;
      }

      await tx.cuenta.update({
        where: { id: cuentaOriginal.id },
        data: { saldoActual: saldoOriginal, actualizadoEn: new Date() },
      });

      // 2. Aplicar saldo en la cuenta nueva (puede ser la misma)
      const cuentaNuevaId = datos.cuentaId ?? transaccion.cuentaId;
      const tipoMovimientoNuevoId = datos.tipoMovimientoId ?? transaccion.tipoMovimientoId;
      const montoNuevo = datos.monto !== undefined ? Number(datos.monto) : montoOriginal;

      const cuentaNueva = await tx.cuenta.findUnique({ where: { id: cuentaNuevaId } });
      const tipoMovimientoNuevo = await tx.tipomovimiento.findUnique({ where: { id: tipoMovimientoNuevoId } });

      let saldoNuevo = Number(cuentaNueva.saldoActual);

      if (tipoMovimientoNuevo.transferencia) {
        // lógica especial si aplica
      } else if (tipoMovimientoNuevo.nombre.toLowerCase() === "ingreso") {
        saldoNuevo += montoNuevo;
      } else {
        saldoNuevo -= montoNuevo;
        if (saldoNuevo < 0) throw new Error("Saldo insuficiente en la cuenta");
      }

      await tx.cuenta.update({
        where: { id: cuentaNueva.id },
        data: { saldoActual: saldoNuevo, actualizadoEn: new Date() },
      });

      // 3. Actualiza la transacción
      return await tx.transaccion.update({
        where: { id: parseInt(id), usuarioId },
        data: {
          ...(datos.monto !== undefined && { monto: datos.monto }),
          ...(datos.descripcion !== undefined && { descripcion: datos.descripcion }),
          ...(datos.fecha !== undefined && { fecha: new Date(datos.fecha) }),
          ...(datos.cuentaId !== undefined && { cuentaId: datos.cuentaId }),
          ...(datos.tipoMovimientoId !== undefined && { tipoMovimientoId: datos.tipoMovimientoId }),
          ...(datos.tipoPagoId !== undefined && { tipoPagoId: datos.tipoPagoId }),
          ...(datos.usuarioCategoriaId !== undefined && { usuarioCategoriaId: datos.usuarioCategoriaId }),
          ...(datos.confirmada !== undefined && { confirmada: datos.confirmada }),
          ...(datos.notas !== undefined && { notas: datos.notas }),
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
          etiquetaontransaccion: { include: { etiqueta: true } },
        },
      });
    });
  }

  // Eliminar transacción
  async eliminar(id, usuarioId) {
    const transaccion = await prisma.transaccion.findFirst({
      where: { id: parseInt(id), usuarioId },
    });
    if (!transaccion) throw new Error("Transacción no encontrada");

    return await prisma.$transaction(async (tx) => {
      const cuenta = await tx.cuenta.findUnique({ where: { id: transaccion.cuentaId } });
      const tipoMovimiento = await tx.tipomovimiento.findUnique({ where: { id: transaccion.tipoMovimientoId } });

      let saldo = Number(cuenta.saldoActual);
      let monto = Number(transaccion.monto);

      if (tipoMovimiento.transferencia) {
        // lógica especial si aplica
      } else if (tipoMovimiento.nombre.toLowerCase() === "ingreso") {
        saldo -= monto;
      } else {
        saldo += monto;
      }

      await tx.cuenta.update({
        where: { id: cuenta.id },
        data: { saldoActual: saldo, actualizadoEn: new Date() },
      });

      await tx.transaccion.delete({
        where: { id: parseInt(id), usuarioId },
      });
    });
  }

  // Agregar etiquetas a transacción
  async agregarEtiquetas(transaccionId, etiquetaIds, usuarioId) {
    // Ya validas la transacción
    const transaccion = await this.obtenerPorId(transaccionId, usuarioId);
    if (!transaccion) throw new Error("Transacción no encontrada");

    // Valida etiquetas
    const etiquetas = await prisma.etiqueta.findMany({
      where: {
        id: { in: etiquetaIds },
        usuarioId,
      },
    });
    if (etiquetas.length !== etiquetaIds.length) {
      throw new Error(
        "Una o más etiquetas no existen o no pertenecen al usuario"
      );
    }

    const etiquetasTransaccion = etiquetaIds.map((etiquetaId) => ({
      transaccionId: parseInt(transaccionId),
      etiquetaId: parseInt(etiquetaId),
    }));

    await prisma.etiquetaontransaccion.createMany({
      data: etiquetasTransaccion,
      skipDuplicates: true,
    });

    return await this.obtenerPorId(transaccionId, usuarioId);
  }

  // Remover etiquetas de transacción
  async removerEtiquetas(transaccionId, etiquetaIds, usuarioId) {
    // Verificar que la transacción pertenece al usuario
    const transaccion = await this.obtenerPorId(transaccionId, usuarioId);
    if (!transaccion) {
      throw new Error("Transacción no encontrada");
    }

    // Verificar que las etiquetas están asociadas a la transacción
    const etiquetasAsociadas = await prisma.etiquetaontransaccion.findMany({
      where: {
        transaccionId: parseInt(transaccionId),
        etiquetaId: { in: etiquetaIds.map((id) => parseInt(id)) },
      },
    });

    if (etiquetasAsociadas.length !== etiquetaIds.length) {
      throw new Error("Una o más etiquetas no están asociadas a la transacción");
    }

    await prisma.etiquetaontransaccion.deleteMany({
      where: {
        transaccionId: parseInt(transaccionId),
        etiquetaId: {
          in: etiquetaIds.map((id) => parseInt(id)),
        },
      },
    });

    return await this.obtenerPorId(transaccionId, usuarioId);
  }

  // Obtener resumen de transacciones por período
  async obtenerResumen(usuarioId, fechaInicio, fechaFin) {
    const where = {
      usuarioId,
      confirmada: true,
      fecha: {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin),
      },
    };

    const resumen = await prisma.transaccion.groupBy({
      by: ["tipoMovimientoId"],
      where,
      _sum: {
        monto: true,
      },
      _count: {
        id: true,
      },
    });

    const tiposMovimiento = await prisma.tipomovimiento.findMany({
      where: {
        id: {
          in: resumen.map((r) => r.tipoMovimientoId),
        },
      },
    });

    return resumen.map((r) => ({
      tipoMovimiento: tiposMovimiento.find(
        (tm) => tm.id === r.tipoMovimientoId
      ),
      totalMonto: r._sum.monto,
      totalTransacciones: r._count.id,
    }));
  }

  // Obtener transacciones por cuenta
  async obtenerPorCuenta(cuentaId, usuarioId, opciones = {}) {
    const cuenta = await prisma.cuenta.findFirst({
      where: { id: cuentaId, usuarioId },
    });
    if (!cuenta)
      throw new Error(
        "La cuenta seleccionada no existe o no pertenece al usuario"
      );

    const { limite = 20, pagina = 1 } = opciones;

    return await this.obtenerPorUsuario(usuarioId, {
      ...opciones,
      cuentaId,
      limite,
      pagina,
    });
  }

  // Confirmar/desconfirmar transacción
  async cambiarEstadoConfirmacion(id, confirmada, usuarioId) {
    const transaccion = await prisma.transaccion.findFirst({
      where: { id: parseInt(id), usuarioId },
    });
    if (!transaccion) throw new Error("Transacción no encontrada");

    return await this.actualizar(id, { confirmada }, usuarioId);
  }
}

module.exports = new TransaccionService();

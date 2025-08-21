const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ReportesService {
  // Resumen general por periodo
  async resumenGeneral(usuarioId, fechaInicio, fechaFin) {
    const where = {
      usuarioId,
      confirmada: true,
      fecha: {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin),
      },
    };

    const [ingresos, gastos, totalTransacciones] = await Promise.all([
      prisma.transaccion.aggregate({
        where: {
          ...where,
          tipomovimiento: { id: 1 },
        },
        _sum: { monto: true },
        _count: { id: true },
      }),
      prisma.transaccion.aggregate({
        where: {
          ...where,
          tipomovimiento: { id: 2 },
        },
        _sum: { monto: true },
        _count: { id: true },
      }),
      prisma.transaccion.count({ where }),
    ]);

    const totalIngresos = ingresos._sum.monto || 0;
    const totalGastos = gastos._sum.monto || 0;
    const balance = totalIngresos - totalGastos;

    return {
      totalIngresos,
      totalGastos,
      balance,
      totalTransacciones,
      cantidadIngresos: ingresos._count.id,
      cantidadGastos: gastos._count.id,
    };
  }

  // Gastos por categoría
  async gastosPorCategoria(usuarioId, fechaInicio, fechaFin) {
    const transacciones = await prisma.transaccion.findMany({
      where: {
        usuarioId,
        confirmada: true,
        fecha: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        },
        tipomovimiento: { id: 2 },
      },
      include: {
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

    const resumen = {};
    transacciones.forEach((t) => {
      const categoria = t.usuariocategoria.categoriabase;
      const key = categoria.id;

      if (!resumen[key]) {
        resumen[key] = {
          categoria: {
            id: categoria.id,
            nombre: categoria.nombre,
            color: categoria.color,
            icono: categoria.icono,
          },
          totalMonto: 0,
          cantidad: 0,
        };
      }

      resumen[key].totalMonto += Number(t.monto);
      resumen[key].cantidad += 1;
    });

    return Object.values(resumen).sort((a, b) => b.totalMonto - a.totalMonto);
  }

  // Ingresos por categoría
  async ingresosPorCategoria(usuarioId, fechaInicio, fechaFin) {
    const transacciones = await prisma.transaccion.findMany({
      where: {
        usuarioId,
        confirmada: true,
        fecha: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        },
        tipomovimiento: { id: 1 },
      },
      include: {
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

    const resumen = {};
    transacciones.forEach((t) => {
      const categoria = t.usuariocategoria.categoriabase;
      const key = categoria.id;

      if (!resumen[key]) {
        resumen[key] = {
          categoria: {
            id: categoria.id,
            nombre: categoria.nombre,
            color: categoria.color,
            icono: categoria.icono,
          },
          totalMonto: 0,
          cantidad: 0,
        };
      }

      resumen[key].totalMonto += Number(t.monto);
      resumen[key].cantidad += 1;
    });

    return Object.values(resumen).sort((a, b) => b.totalMonto - a.totalMonto);
  }

  // Movimientos por cuenta
  async movimientosPorCuenta(usuarioId, fechaInicio, fechaFin) {
    const transacciones = await prisma.transaccion.findMany({
      where: {
        usuarioId,
        confirmada: true,
        fecha: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        },
      },
      include: {
        cuenta: true,
        tipomovimiento: true,
      },
    });

    const resumen = {};
    transacciones.forEach((t) => {
      const key = t.cuenta.id;

      if (!resumen[key]) {
        resumen[key] = {
          cuenta: {
            id: t.cuenta.id,
            nombre: t.cuenta.nombre,
            tipo: t.cuenta.tipo,
            color: t.cuenta.color,
          },
          ingresos: 0,
          gastos: 0,
          cantidad: 0,
        };
      }

      if (t.tipomovimiento.id === 1) {
        resumen[key].ingresos += Number(t.monto);
      } else if (t.tipomovimiento.id === 2) {
        resumen[key].gastos += Number(t.monto);
      }
      resumen[key].cantidad += 1;

    });

    return Object.values(resumen).map((item) => ({
      ...item,
      balance: item.ingresos - item.gastos,
    }));
  }

  // Tendencia mensual
  async tendenciaMensual(usuarioId, fechaInicio, fechaFin) {
    const transacciones = await prisma.transaccion.findMany({
      where: {
        usuarioId,
        confirmada: true,
        fecha: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        },
      },
      include: {
        tipomovimiento: true,
      },
      orderBy: { fecha: "asc" },
    });

    const tendencia = {};
    transacciones.forEach((t) => {
      const fecha = new Date(t.fecha);
      const key = `${fecha.getFullYear()}-${String(
        fecha.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!tendencia[key]) {
        tendencia[key] = {
          periodo: key,
          ingresos: 0,
          gastos: 0,
          transacciones: 0,
        };
      }

      if (t.tipomovimiento.id === 1) {
        tendencia[key].ingresos += Number(t.monto);
      } else if (t.tipomovimiento.id === 2) {
        tendencia[key].gastos += Number(t.monto);
      }
      tendencia[key].transacciones += 1;
    });

    return Object.values(tendencia)
      .map((item) => ({
        ...item,
        balance: item.ingresos - item.gastos,
      }))
      .sort((a, b) => a.periodo.localeCompare(b.periodo));
  }

  // Análisis de etiquetas
  async analisisEtiquetas(usuarioId, fechaInicio, fechaFin) {
    const etiquetasTransacciones = await prisma.etiquetaontransaccion.findMany({
      where: {
        transaccion: {
          usuarioId,
          confirmada: true,
          fecha: {
            gte: new Date(fechaInicio),
            lte: new Date(fechaFin),
          },
        },
      },
      include: {
        etiqueta: true,
        transaccion: {
          include: {
            tipomovimiento: true,
          },
        },
      },
    });

    const resumen = {};
    etiquetasTransacciones.forEach((et) => {
      const key = et.etiqueta.id;

      if (!resumen[key]) {
        resumen[key] = {
          etiqueta: {
            id: et.etiqueta.id,
            nombre: et.etiqueta.nombre,
            color: et.etiqueta.color,
          },
          totalMonto: 0,
          cantidad: 0,
          ingresos: 0,
          gastos: 0,
        };
      }

      const monto = Number(et.transaccion.monto);
      resumen[key].totalMonto += monto;
      resumen[key].cantidad += 1;

      if (et.transaccion.tipomovimiento.id === 1) {
        resumen[key].ingresos += monto;
      } else if (et.transaccion.tipomovimiento.id === 2) {
        resumen[key].gastos += monto;
      }
    });

    return Object.values(resumen).sort((a, b) => b.cantidad - a.cantidad);
  }

  // Comparativa entre períodos
  async comparativaPeriodos(
    usuarioId,
    fechaInicio1,
    fechaFin1,
    fechaInicio2,
    fechaFin2
  ) {
    const [periodo1, periodo2] = await Promise.all([
      this.resumenGeneral(usuarioId, fechaInicio1, fechaFin1),
      this.resumenGeneral(usuarioId, fechaInicio2, fechaFin2),
    ]);

    return {
      periodo1: {
        ...periodo1,
        fechaInicio: fechaInicio1,
        fechaFin: fechaFin1,
      },
      periodo2: {
        ...periodo2,
        fechaInicio: fechaInicio2,
        fechaFin: fechaFin2,
      },
      diferencias: {
        ingresos:
          Number(periodo2.totalIngresos) - Number(periodo1.totalIngresos),
        gastos: Number(periodo2.totalGastos) - Number(periodo1.totalGastos),
        balance: Number(periodo2.balance) - Number(periodo1.balance),
        transacciones:
          periodo2.totalTransacciones - periodo1.totalTransacciones,
      },
    };
  }

  // Estado actual de cuentas
  async estadoCuentas(usuarioId) {
    const cuentas = await prisma.cuenta.findMany({
      where: {
        usuarioId,
        activo: true,
      },
      orderBy: { orden: "asc" },
    });



    const totalPatrimonio = cuentas.reduce(
      (total, cuenta) => total + Number(cuenta.saldoActual),
      0
    );

    return {
      cuentas: cuentas.map((cuenta) => ({
        id: cuenta.id,
        nombre: cuenta.nombre,
        tipo: cuenta.tipo,
        saldoActual: cuenta.saldoActual,
        color: cuenta.color,
        porcentaje:
          totalPatrimonio > 0
            ? (Number(cuenta.saldoActual) / totalPatrimonio) * 100
            : 0,
      })),
      totalPatrimonio,
    };
  }

  // Top transacciones
  async topTransacciones(
    usuarioId,
    fechaInicio,
    fechaFin,
    limite = 10,
    tipo = 2,
  ) {
    return await prisma.transaccion.findMany({
      where: {
        usuarioId,
        confirmada: true,
        fecha: {
          gte: new Date(fechaInicio),
          lte: new Date(fechaFin),
        },
        tipomovimiento: { id: tipo },
      },
      include: {
        cuenta: true,
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
      orderBy: { monto: "desc" },
      take: limite,
    });
  }
}

module.exports = new ReportesService();

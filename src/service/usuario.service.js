const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class UsuarioService {
  // Crear o actualizar usuario (para login/registro con Google)
  async crearOActualizar(datosGoogle) {
    return await prisma.usuario.upsert({
      where: { id: datosGoogle.id },
      update: {
        nombre: datosGoogle.nombre,
        correo: datosGoogle.correo,
        foto: datosGoogle.foto,
        actualizadoEn: new Date(),
      },
      create: {
        id: datosGoogle.id,
        nombre: datosGoogle.nombre,
        correo: datosGoogle.correo,
        foto: datosGoogle.foto,
        actualizadoEn: new Date(),
      },
    });
  }

  // Obtener usuario por ID
  async obtenerPorId(id) {
    return await prisma.usuario.findUnique({
      where: { id },
      include: {
        cuenta: {
          where: { activo: true },
          orderBy: { orden: "asc" },
        },
        usuariocategoria: {
          where: { activo: true },
          include: {
            categoriabase: {
              include: {
                icono: true,
                color: true,
              },
            },
            tipomovimiento: true,
          },
        },
        etiqueta: {
          where: { activo: true },
        },
      },
    });
  }

  // Actualizar perfil de usuario
  async actualizar(id, datos) {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    return await prisma.usuario.update({
      where: { id },
      data: {
        ...(datos.nombre && { nombre: datos.nombre }),
        ...(datos.correo && { correo: datos.correo }),
        ...(datos.foto && { foto: datos.foto }),
        actualizadoEn: new Date(),
      },
    });
  }

  // Obtener resumen del usuario (dashboard)
  async obtenerResumen(usuarioId) {
    const [usuario, cuentas, transaccionesRecientes, proyeccionesPendientes] =
      await Promise.all([
        prisma.usuario.findUnique({
          where: { id: usuarioId },
        }),

        prisma.cuenta.findMany({
          where: { usuarioId, activo: true },
          orderBy: { orden: "asc" },
        }),

        prisma.transaccion.findMany({
          where: { usuarioId, confirmada: true },
          include: {
            cuenta: true,
            tipomovimiento: true,
            usuariocategoria: {
              include: {
                categoriabase: {
                  include: { icono: true, color: true },
                },
              },
            },
          },
          orderBy: { fecha: "desc" },
          take: 5,
        }),

        prisma.proyeccion.findMany({
          where: {
            usuarioId,
            estado: "PENDIENTE",
            fecha: {
              lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // próximos 7 días
            },
          },
          include: {
            cuenta: true,
            tipomovimiento: true,
            usuariocategoria: {
              include: {
                categoriabase: {
                  include: { icono: true, color: true },
                },
              },
            },
          },
          orderBy: { fecha: "asc" },
          take: 5,
        }),
      ]);

    // Calcular balance total
    const balanceTotal = cuentas.reduce((total, cuenta) => {
      return total + Number(cuenta.saldoActual);
    }, 0);

    return {
      usuario,
      cuentas,
      balanceTotal,
      transaccionesRecientes,
      proyeccionesPendientes,
    };
  }

  // Inicializar categorías base para el usuario
  async inicializarCategorias(usuarioId) {
    // Obtener categorías base activas
    const categoriasBase = await prisma.categoriabase.findMany({
      where: { activo: true },
      include: {
        tipomovimiento: true,
      },
    });

    // Crear relaciones usuario-categoria para todas las categorías base
    const usuarioCategorias = categoriasBase.map((categoria) => ({
      usuarioId,
      categoriaBaseId: categoria.id,
      tipoMovimientoId: categoria.tipoMovimientoId,
    }));

    await prisma.usuariocategoria.createMany({
      data: usuarioCategorias,
      skipDuplicates: true,
    });

    return await prisma.usuariocategoria.findMany({
      where: { usuarioId },
      include: {
        categoriabase: {
          include: {
            icono: true,
            color: true,
          },
        },
        tipomovimiento: true,
      },
    });
  }

  // Desactivar usuario (soft delete)
  async desactivar(id) {
    return await prisma.usuario.update({
      where: { id },
      data: {
        activo: false,
        actualizadoEn: new Date(),
      },
    });
  }

  // Reactivar usuario
  async reactivar(id) {
    return await prisma.usuario.update({
      where: { id },
      data: {
        activo: true,
        actualizadoEn: new Date(),
      },
    });
  }

  // Obtener estadísticas del usuario
  async obtenerEstadisticas(usuarioId, fechaInicio, fechaFin) {
    const where = {
      usuarioId,
      confirmada: true,
      fecha: {
        gte: new Date(fechaInicio),
        lte: new Date(fechaFin),
      },
    };

    const [
      totalTransacciones,
      totalIngresos,
      totalEgresos,
      categoriasMasUsadas,
    ] = await Promise.all([
      prisma.transaccion.count({ where }),

      prisma.transaccion.aggregate({
        where: {
          ...where,
          tipomovimiento: {
            nombre: "ingreso",
          },
        },
        _sum: { monto: true },
        _count: { id: true },
      }),

      prisma.transaccion.aggregate({
        where: {
          ...where,
          tipomovimiento: {
            nombre: "egreso",
          },
        },
        _sum: { monto: true },
        _count: { id: true },
      }),

      prisma.transaccion.groupBy({
        by: ["usuarioCategoriaId"],
        where,
        _sum: { monto: true },
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: 5,
      }),
    ]);

    // Obtener información de las categorías más usadas
    const categoriasInfo = await prisma.usuariocategoria.findMany({
      where: {
        id: { in: categoriasMasUsadas.map((c) => c.usuarioCategoriaId) },
      },
      include: {
        categoriabase: {
          include: { icono: true, color: true },
        },
      },
    });

    const categoriasMasUsadasConInfo = categoriasMasUsadas.map((cat) => {
      const info = categoriasInfo.find((c) => c.id === cat.usuarioCategoriaId);
      return {
        ...cat,
        categoria: info?.categoriabase,
      };
    });

    return {
      totalTransacciones,
      ingresos: {
        total: totalIngresos._sum.monto || 0,
        cantidad: totalIngresos._count.id,
      },
      egresos: {
        total: totalEgresos._sum.monto || 0,
        cantidad: totalEgresos._count.id,
      },
      balance: (totalIngresos._sum.monto || 0) - (totalEgresos._sum.monto || 0),
      categoriasMasUsadas: categoriasMasUsadasConInfo,
    };
  }
}

module.exports = new UsuarioService();

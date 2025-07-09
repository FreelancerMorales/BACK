const prisma = require("../prismaClient");
const { answerOk, answerError } = require("../utils/answers");

// GET /categorias
const obtenerCategorias = async (req, res) => {
  const { tipoMovimientoId, padreId, activo, limit, page } = req.query;
  const limitNum = parseInt(limit) || 50;
  const pageNum = parseInt(page) || 1;
  const skip = (pageNum - 1) * limitNum;

  try {
    const where = {
      usuarioId: req.usuario.id,
      ...(tipoMovimientoId && { tipoMovimientoId: parseInt(tipoMovimientoId) }),
      ...(padreId !== undefined && {
        padreId:
          padreId === "null" || padreId === "" ? null : parseInt(padreId),
      }),
    };

    const categorias = await prisma.categoria.findMany({
      where,
      orderBy: { nombre: "asc" },
      skip,
      take: limitNum,
      include: {
        tipoMovimiento: {
          select: { id: true, nombre: true },
        },
        padre: {
          select: { id: true, nombre: true },
        },
        subcategorias: {
          select: { id: true, nombre: true, icono: true, color: true },
        },
        _count: {
          select: {
            transacciones: true,
            subcategorias: true,
          },
        },
      },
    });

    const total = await prisma.categoria.count({ where });

    return answerOk(
      res,
      {
        categorias,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
      "Categorías obtenidas correctamente"
    );
  } catch (error) {
    console.error(
      `obtenerCategorias: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener las categorías");
  }
};

// GET /categorias/jerarquia
const obtenerJerarquiaCategorias = async (req, res) => {
  const { tipoMovimientoId } = req.query;

  try {
    const where = {
      usuarioId: req.usuario.id,
      padreId: null, // Solo categorías padre
      ...(tipoMovimientoId && { tipoMovimientoId: parseInt(tipoMovimientoId) }),
    };

    const categoriasPadre = await prisma.categoria.findMany({
      where,
      orderBy: { nombre: "asc" },
      include: {
        tipoMovimiento: {
          select: { id: true, nombre: true },
        },
        subcategorias: {
          orderBy: { nombre: "asc" },
          include: {
            _count: {
              select: { transacciones: true },
            },
          },
        },
        _count: {
          select: {
            transacciones: true,
            subcategorias: true,
          },
        },
      },
    });

    return answerOk(
      res,
      categoriasPadre,
      "Jerarquía de categorías obtenida correctamente"
    );
  } catch (error) {
    console.error(
      `obtenerJerarquiaCategorias: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener la jerarquía de categorías");
  }
};

// GET /categorias/:id
const obtenerCategoriaPorId = async (req, res) => {
  const categoriaId = parseInt(req.params.id);

  if (isNaN(categoriaId)) {
    return answerError(res, "ID de categoría inválido", 400);
  }

  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId },
      include: {
        tipoMovimiento: {
          select: { id: true, nombre: true },
        },
        padre: {
          select: { id: true, nombre: true },
        },
        subcategorias: {
          orderBy: { nombre: "asc" },
          include: {
            _count: {
              select: { transacciones: true },
            },
          },
        },
        _count: {
          select: {
            transacciones: true,
            subcategorias: true,
          },
        },
      },
    });

    if (!categoria || categoria.usuarioId !== req.usuario.id) {
      return answerError(res, "Categoría no encontrada", 404);
    }

    return answerOk(res, categoria, "Categoría obtenida correctamente");
  } catch (error) {
    console.error(
      `obtenerCategoriaPorId: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener la categoría");
  }
};

// GET /categorias/:id/estadisticas
const obtenerEstadisticasCategoria = async (req, res) => {
  const categoriaId = parseInt(req.params.id);
  const { fechaInicio, fechaFin } = req.query;

  if (isNaN(categoriaId)) {
    return answerError(res, "ID de categoría inválido", 400);
  }

  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId },
    });

    if (!categoria || categoria.usuarioId !== req.usuario.id) {
      return answerError(res, "Categoría no encontrada", 404);
    }

    // Construir filtros de fecha
    const fechaFiltro = {};
    if (fechaInicio) fechaFiltro.gte = new Date(fechaInicio);
    if (fechaFin) fechaFiltro.lte = new Date(fechaFin);

    const whereTransacciones = {
      categoriaId,
      usuarioId: req.usuario.id,
      ...(Object.keys(fechaFiltro).length > 0 && { fecha: fechaFiltro }),
    };

    // Estadísticas de transacciones
    const estadisticas = await prisma.transaccion.aggregate({
      where: whereTransacciones,
      _sum: { monto: true },
      _count: { id: true },
      _avg: { monto: true },
      _min: { monto: true },
      _max: { monto: true },
    });

    // Transacciones por cuenta
    const transaccionesPorCuenta = await prisma.transaccion.groupBy({
      by: ["cuentaId"],
      where: whereTransacciones,
      _sum: { monto: true },
      _count: { id: true },
    });

    // Obtener nombres de cuentas
    const cuentasIds = transaccionesPorCuenta.map((t) => t.cuentaId);
    const cuentas = await prisma.cuenta.findMany({
      where: { id: { in: cuentasIds } },
      select: { id: true, nombre: true },
    });

    const cuentaMap = Object.fromEntries(cuentas.map((c) => [c.id, c.nombre]));

    const estadisticasPorCuenta = transaccionesPorCuenta.map((t) => ({
      cuentaId: t.cuentaId,
      nombreCuenta: cuentaMap[t.cuentaId],
      totalMonto: parseFloat((t._sum.monto || 0).toFixed(2)),
      totalTransacciones: t._count.id,
    }));

    return answerOk(
      res,
      {
        categoria: {
          id: categoria.id,
          nombre: categoria.nombre,
        },
        resumen: {
          totalMonto: parseFloat((estadisticas._sum.monto || 0).toFixed(2)),
          totalTransacciones: estadisticas._count.id,
          promedioMonto: parseFloat((estadisticas._avg.monto || 0).toFixed(2)),
          montoMinimo: parseFloat((estadisticas._min.monto || 0).toFixed(2)),
          montoMaximo: parseFloat((estadisticas._max.monto || 0).toFixed(2)),
        },
        cuentas: estadisticasPorCuenta,
      },
      "Estadísticas de categoría obtenidas"
    );
  } catch (error) {
    console.error(
      `obtenerEstadisticasCategoria: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener las estadísticas");
  }
};

// POST /categorias
const crearCategoria = async (req, res) => {
  const { nombre, icono, color, tipoMovimientoId, padreId } = req.body;

  try {
    // Validar que el tipo de movimiento existe
    const tipoMovimiento = await prisma.tipoMovimiento.findUnique({
      where: { id: tipoMovimientoId },
    });

    if (!tipoMovimiento) {
      return answerError(res, "Tipo de movimiento no válido", 400);
    }

    // Validar padre si se proporciona
    if (padreId) {
      const categoriaPadre = await prisma.categoria.findUnique({
        where: { id: padreId },
      });

      if (!categoriaPadre || categoriaPadre.usuarioId !== req.usuario.id) {
        return answerError(res, "Categoría padre no válida", 400);
      }

      // Validar que la categoría padre sea del mismo tipo de movimiento
      if (categoriaPadre.tipoMovimientoId !== tipoMovimientoId) {
        return answerError(
          res,
          "La categoría padre debe ser del mismo tipo de movimiento",
          400
        );
      }

      // Validar que la categoría padre no sea ya una subcategoría
      if (categoriaPadre.padreId) {
        return answerError(
          res,
          "No se pueden crear subcategorías de subcategorías",
          400
        );
      }
    }

    // Validar si ya existe una categoría con el mismo nombre para el usuario
    const categoriaExistente = await prisma.categoria.findFirst({
      where: {
        nombre: nombre.trim(),
        usuarioId: req.usuario.id,
        tipoMovimientoId,
        padreId: padreId || null,
      },
    });

    if (categoriaExistente) {
      return answerError(res, "Ya existe una categoría con este nombre", 409);
    }

    const nuevaCategoria = await prisma.categoria.create({
      data: {
        nombre: nombre.trim(),
        icono: icono || null,
        color: color || "#6366f1",
        tipoMovimientoId,
        padreId: padreId || null,
        usuarioId: req.usuario.id,
      },
      include: {
        tipoMovimiento: {
          select: { id: true, nombre: true },
        },
        padre: {
          select: { id: true, nombre: true },
        },
      },
    });

    return answerOk(res, nuevaCategoria, "Categoría creada correctamente", 201);
  } catch (error) {
    console.error(
      `crearCategoria: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo crear la categoría");
  }
};

// PUT /categorias/:id
const actualizarCategoria = async (req, res) => {
  const categoriaId = parseInt(req.params.id);
  const { nombre, icono, color, tipoMovimientoId, padreId } = req.body;

  if (isNaN(categoriaId)) {
    return answerError(res, "ID de categoría inválido", 400);
  }

  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId },
      include: {
        subcategorias: {
          select: { id: true },
        },
      },
    });

    if (!categoria || categoria.usuarioId !== req.usuario.id) {
      return answerError(res, "Categoría no encontrada", 404);
    }

    // Validar tipo de movimiento si se está cambiando
    if (tipoMovimientoId && tipoMovimientoId !== categoria.tipoMovimientoId) {
      const tipoMovimiento = await prisma.tipoMovimiento.findUnique({
        where: { id: tipoMovimientoId },
      });

      if (!tipoMovimiento) {
        return answerError(res, "Tipo de movimiento no válido", 400);
      }

      // Si tiene subcategorías, no permitir cambiar el tipo de movimiento
      if (categoria.subcategorias.length > 0) {
        return answerError(
          res,
          "No se puede cambiar el tipo de movimiento de una categoría con subcategorías",
          400
        );
      }
    }

    // Validar padre si se está cambiando
    if (padreId !== undefined && padreId !== categoria.padreId) {
      if (padreId) {
        const categoriaPadre = await prisma.categoria.findUnique({
          where: { id: padreId },
        });

        if (!categoriaPadre || categoriaPadre.usuarioId !== req.usuario.id) {
          return answerError(res, "Categoría padre no válida", 400);
        }

        // Validar que no se esté intentando hacer padre de sí misma
        if (padreId === categoriaId) {
          return answerError(
            res,
            "Una categoría no puede ser padre de sí misma",
            400
          );
        }

        // Validar que la categoría padre sea del mismo tipo de movimiento
        const tipoMovimientoFinal =
          tipoMovimientoId || categoria.tipoMovimientoId;
        if (categoriaPadre.tipoMovimientoId !== tipoMovimientoFinal) {
          return answerError(
            res,
            "La categoría padre debe ser del mismo tipo de movimiento",
            400
          );
        }

        // Validar que la categoría padre no sea ya una subcategoría
        if (categoriaPadre.padreId) {
          return answerError(
            res,
            "No se pueden crear subcategorías de subcategorías",
            400
          );
        }
      }

      // Si la categoría tiene subcategorías, no permitir que se convierta en subcategoría
      if (padreId && categoria.subcategorias.length > 0) {
        return answerError(
          res,
          "No se puede convertir en subcategoría una categoría que tiene subcategorías",
          400
        );
      }
    }

    // Validar nombre único si se está cambiando
    if (nombre && nombre.trim() !== categoria.nombre) {
      const categoriaConMismoNombre = await prisma.categoria.findFirst({
        where: {
          nombre: nombre.trim(),
          usuarioId: req.usuario.id,
          tipoMovimientoId: tipoMovimientoId || categoria.tipoMovimientoId,
          padreId: padreId !== undefined ? padreId : categoria.padreId,
          id: { not: categoriaId },
        },
      });

      if (categoriaConMismoNombre) {
        return answerError(res, "Ya existe una categoría con este nombre", 409);
      }
    }

    const datosActualizacion = {};
    if (nombre !== undefined) datosActualizacion.nombre = nombre.trim();
    if (icono !== undefined) datosActualizacion.icono = icono;
    if (color !== undefined) datosActualizacion.color = color;
    if (tipoMovimientoId !== undefined)
      datosActualizacion.tipoMovimientoId = tipoMovimientoId;
    if (padreId !== undefined) datosActualizacion.padreId = padreId;

    const categoriaActualizada = await prisma.categoria.update({
      where: { id: categoriaId },
      data: datosActualizacion,
      include: {
        tipoMovimiento: {
          select: { id: true, nombre: true },
        },
        padre: {
          select: { id: true, nombre: true },
        },
        subcategorias: {
          select: { id: true, nombre: true },
        },
      },
    });

    return answerOk(
      res,
      categoriaActualizada,
      "Categoría actualizada correctamente"
    );
  } catch (error) {
    console.error(
      `actualizarCategoria: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo actualizar la categoría");
  }
};

// DELETE /categorias/:id
const eliminarCategoria = async (req, res) => {
  const categoriaId = parseInt(req.params.id);

  if (isNaN(categoriaId)) {
    return answerError(res, "ID de categoría inválido", 400);
  }

  try {
    const categoria = await prisma.categoria.findUnique({
      where: { id: categoriaId },
      include: {
        subcategorias: {
          select: { id: true },
        },
        _count: {
          select: {
            transacciones: true,
            plantillas: true,
            proyecciones: true,
          },
        },
      },
    });

    if (!categoria || categoria.usuarioId !== req.usuario.id) {
      return answerError(res, "Categoría no encontrada", 404);
    }

    // Verificar si tiene subcategorías
    if (categoria.subcategorias.length > 0) {
      return answerError(
        res,
        "No se puede eliminar una categoría que tiene subcategorías. Elimine primero las subcategorías.",
        400
      );
    }

    // Verificar si tiene transacciones, plantillas o proyecciones
    const tieneRelaciones =
      categoria._count.transacciones > 0 ||
      categoria._count.plantillas > 0 ||
      categoria._count.proyecciones > 0;

    if (tieneRelaciones) {
      return answerError(
        res,
        "No se puede eliminar una categoría que tiene transacciones, plantillas o proyecciones asociadas.",
        400
      );
    }

    await prisma.categoria.delete({
      where: { id: categoriaId },
    });

    return answerOk(
      res,
      { mensaje: "Categoría eliminada correctamente" },
      "Categoría eliminada correctamente"
    );
  } catch (error) {
    console.error(
      `eliminarCategoria: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo eliminar la categoría");
  }
};

module.exports = {
  obtenerCategorias,
  obtenerJerarquiaCategorias,
  obtenerCategoriaPorId,
  obtenerEstadisticasCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};

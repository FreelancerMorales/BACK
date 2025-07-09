const prisma = require("../prismaClient");
const { answerOk, answerError } = require("../utils/answers");

// GET /tipos-movimiento
const obtenerTiposMovimiento = async (req, res) => {
  const { limit, page } = req.query;
  const limitNum = parseInt(limit) || 50;
  const pageNum = parseInt(page) || 1;
  const skip = (pageNum - 1) * limitNum;

  try {
    const tiposMovimiento = await prisma.tipoMovimiento.findMany({
      orderBy: { nombre: "asc" },
      skip,
      take: limitNum,
      include: {
        _count: {
          select: {
            categorias: true,
            transacciones: true,
            plantillas: true,
            proyecciones: true,
          },
        },
      },
    });

    const total = await prisma.tipoMovimiento.count();

    return answerOk(
      res,
      {
        tiposMovimiento,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
      "Tipos de movimiento obtenidos correctamente"
    );
  } catch (error) {
    console.error(
      `obtenerTiposMovimiento: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener los tipos de movimiento");
  }
};

// GET /tipos-movimiento/:id
const obtenerTipoMovimientoPorId = async (req, res) => {
  const tipoMovimientoId = parseInt(req.params.id);

  if (isNaN(tipoMovimientoId)) {
    return answerError(res, "ID de tipo de movimiento inválido", 400);
  }

  try {
    const tipoMovimiento = await prisma.tipoMovimiento.findUnique({
      where: { id: tipoMovimientoId },
      include: {
        _count: {
          select: {
            categorias: true,
            transacciones: true,
            plantillas: true,
            proyecciones: true,
          },
        },
      },
    });

    if (!tipoMovimiento) {
      return answerError(res, "Tipo de movimiento no encontrado", 404);
    }

    return answerOk(
      res,
      tipoMovimiento,
      "Tipo de movimiento obtenido correctamente"
    );
  } catch (error) {
    console.error(
      `obtenerTipoMovimientoPorId: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener el tipo de movimiento");
  }
};

// GET /tipos-movimiento/:id/categorias
const obtenerCategoriasPorTipo = async (req, res) => {
  const tipoMovimientoId = parseInt(req.params.id);
  const { limit, page } = req.query;
  const limitNum = parseInt(limit) || 50;
  const pageNum = parseInt(page) || 1;
  const skip = (pageNum - 1) * limitNum;

  if (isNaN(tipoMovimientoId)) {
    return answerError(res, "ID de tipo de movimiento inválido", 400);
  }

  try {
    const tipoMovimiento = await prisma.tipoMovimiento.findUnique({
      where: { id: tipoMovimientoId },
    });

    if (!tipoMovimiento) {
      return answerError(res, "Tipo de movimiento no encontrado", 404);
    }

    const where = {
      tipoMovimientoId,
      usuarioId: req.usuario.id,
    };

    const categorias = await prisma.categoria.findMany({
      where,
      orderBy: { nombre: "asc" },
      skip,
      take: limitNum,
      include: {
        padre: true,
        subcategorias: true,
        _count: {
          select: {
            transacciones: true,
            plantillas: true,
            proyecciones: true,
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
        tipoMovimiento: tipoMovimiento.nombre,
      },
      "Categorías obtenidas correctamente"
    );
  } catch (error) {
    console.error(
      `obtenerCategoriasPorTipo: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener las categorías");
  }
};

// GET /tipos-movimiento/:id/estadisticas
const obtenerEstadisticasPorTipo = async (req, res) => {
  const tipoMovimientoId = parseInt(req.params.id);
  const { fechaInicio, fechaFin } = req.query;

  if (isNaN(tipoMovimientoId)) {
    return answerError(res, "ID de tipo de movimiento inválido", 400);
  }

  try {
    const tipoMovimiento = await prisma.tipoMovimiento.findUnique({
      where: { id: tipoMovimientoId },
    });

    if (!tipoMovimiento) {
      return answerError(res, "Tipo de movimiento no encontrado", 404);
    }

    // Construir filtros de fecha
    const fechaFiltro = {};
    if (fechaInicio) fechaFiltro.gte = new Date(fechaInicio);
    if (fechaFin) fechaFiltro.lte = new Date(fechaFin);

    const whereTransacciones = {
      tipoMovimientoId,
      usuarioId: req.usuario.id,
      ...(Object.keys(fechaFiltro).length > 0 && { fecha: fechaFiltro }),
    };

    // Estadísticas por categoría
    const estadisticasCategorias = await prisma.transaccion.groupBy({
      by: ["categoriaId"],
      where: whereTransacciones,
      _sum: { monto: true },
      _count: { id: true },
      _avg: { monto: true },
      orderBy: { _sum: { monto: "desc" } },
    });

    // Obtener nombres de categorías
    const categoriaIds = estadisticasCategorias.map((stat) => stat.categoriaId);
    const categorias = await prisma.categoria.findMany({
      where: { id: { in: categoriaIds } },
      select: { id: true, nombre: true, icono: true, color: true },
    });

    const categoriaMap = Object.fromEntries(
      categorias.map((cat) => [cat.id, cat])
    );

    // Estadísticas por cuenta
    const estadisticasCuentas = await prisma.transaccion.groupBy({
      by: ["cuentaId"],
      where: whereTransacciones,
      _sum: { monto: true },
      _count: { id: true },
      orderBy: { _sum: { monto: "desc" } },
    });

    // Obtener nombres de cuentas
    const cuentaIds = estadisticasCuentas.map((stat) => stat.cuentaId);
    const cuentas = await prisma.cuenta.findMany({
      where: { id: { in: cuentaIds } },
      select: { id: true, nombre: true, tipo: true, color: true },
    });

    const cuentaMap = Object.fromEntries(
      cuentas.map((cuenta) => [cuenta.id, cuenta])
    );

    // Estadísticas generales
    const estadisticasGenerales = await prisma.transaccion.aggregate({
      where: whereTransacciones,
      _sum: { monto: true },
      _count: { id: true },
      _avg: { monto: true },
      _min: { monto: true },
      _max: { monto: true },
    });

    const estadisticasFormateadas = {
      general: {
        totalMonto: parseFloat(
          (estadisticasGenerales._sum.monto || 0).toFixed(2)
        ),
        totalTransacciones: estadisticasGenerales._count.id,
        promedioMonto: parseFloat(
          (estadisticasGenerales._avg.monto || 0).toFixed(2)
        ),
        montoMinimo: parseFloat(
          (estadisticasGenerales._min.monto || 0).toFixed(2)
        ),
        montoMaximo: parseFloat(
          (estadisticasGenerales._max.monto || 0).toFixed(2)
        ),
      },
      categorias: estadisticasCategorias.map((stat) => ({
        categoria: categoriaMap[stat.categoriaId],
        totalMonto: parseFloat((stat._sum.monto || 0).toFixed(2)),
        totalTransacciones: stat._count.id,
        promedioMonto: parseFloat((stat._avg.monto || 0).toFixed(2)),
      })),
      cuentas: estadisticasCuentas.map((stat) => ({
        cuenta: cuentaMap[stat.cuentaId],
        totalMonto: parseFloat((stat._sum.monto || 0).toFixed(2)),
        totalTransacciones: stat._count.id,
      })),
    };

    return answerOk(
      res,
      {
        tipoMovimiento: tipoMovimiento.nombre,
        periodo: {
          fechaInicio: fechaInicio || "Sin límite",
          fechaFin: fechaFin || "Sin límite",
        },
        estadisticas: estadisticasFormateadas,
      },
      "Estadísticas obtenidas correctamente"
    );
  } catch (error) {
    console.error(
      `obtenerEstadisticasPorTipo: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener las estadísticas");
  }
};

// POST /tipos-movimiento (solo para administradores del sistema)
const crearTipoMovimiento = async (req, res) => {
  const { nombre } = req.body;

  try {
    // Verificar si ya existe un tipo con el mismo nombre
    const tipoExistente = await prisma.tipoMovimiento.findUnique({
      where: { nombre: nombre.trim() },
    });

    if (tipoExistente) {
      return answerError(
        res,
        "Ya existe un tipo de movimiento con este nombre",
        409
      );
    }

    const nuevoTipo = await prisma.tipoMovimiento.create({
      data: {
        nombre: nombre.trim(),
      },
    });

    return answerOk(
      res,
      nuevoTipo,
      "Tipo de movimiento creado correctamente",
      201
    );
  } catch (error) {
    console.error(
      `crearTipoMovimiento: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo crear el tipo de movimiento");
  }
};

// PUT /tipos-movimiento/:id (solo para administradores del sistema)
const actualizarTipoMovimiento = async (req, res) => {
  const tipoMovimientoId = parseInt(req.params.id);
  const { nombre } = req.body;

  if (isNaN(tipoMovimientoId)) {
    return answerError(res, "ID de tipo de movimiento inválido", 400);
  }

  try {
    const tipoMovimiento = await prisma.tipoMovimiento.findUnique({
      where: { id: tipoMovimientoId },
    });

    if (!tipoMovimiento) {
      return answerError(res, "Tipo de movimiento no encontrado", 404);
    }

    // Verificar si ya existe otro tipo con el mismo nombre
    if (nombre && nombre !== tipoMovimiento.nombre) {
      const tipoConMismoNombre = await prisma.tipoMovimiento.findUnique({
        where: { nombre: nombre.trim() },
      });

      if (tipoConMismoNombre) {
        return answerError(
          res,
          "Ya existe un tipo de movimiento con este nombre",
          409
        );
      }
    }

    const tipoActualizado = await prisma.tipoMovimiento.update({
      where: { id: tipoMovimientoId },
      data: {
        nombre: nombre.trim(),
      },
    });

    return answerOk(
      res,
      tipoActualizado,
      "Tipo de movimiento actualizado correctamente"
    );
  } catch (error) {
    console.error(
      `actualizarTipoMovimiento: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo actualizar el tipo de movimiento");
  }
};

// DELETE /tipos-movimiento/:id (solo para administradores del sistema)
const eliminarTipoMovimiento = async (req, res) => {
  const tipoMovimientoId = parseInt(req.params.id);

  if (isNaN(tipoMovimientoId)) {
    return answerError(res, "ID de tipo de movimiento inválido", 400);
  }

  try {
    const tipoMovimiento = await prisma.tipoMovimiento.findUnique({
      where: { id: tipoMovimientoId },
      include: {
        _count: {
          select: {
            categorias: true,
            transacciones: true,
            plantillas: true,
            proyecciones: true,
          },
        },
      },
    });

    if (!tipoMovimiento) {
      return answerError(res, "Tipo de movimiento no encontrado", 404);
    }

    // Verificar si tiene registros relacionados
    const tieneRelaciones =
      tipoMovimiento._count.categorias > 0 ||
      tipoMovimiento._count.transacciones > 0 ||
      tipoMovimiento._count.plantillas > 0 ||
      tipoMovimiento._count.proyecciones > 0;

    if (tieneRelaciones) {
      return answerError(
        res,
        "No se puede eliminar el tipo de movimiento porque tiene registros relacionados",
        409
      );
    }

    await prisma.tipoMovimiento.delete({
      where: { id: tipoMovimientoId },
    });

    return answerOk(
      res,
      { id: tipoMovimientoId },
      "Tipo de movimiento eliminado correctamente"
    );
  } catch (error) {
    console.error(
      `eliminarTipoMovimiento: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo eliminar el tipo de movimiento");
  }
};

module.exports = {
  obtenerTiposMovimiento,
  obtenerTipoMovimientoPorId,
  obtenerCategoriasPorTipo,
  obtenerEstadisticasPorTipo,
  crearTipoMovimiento,
  actualizarTipoMovimiento,
  eliminarTipoMovimiento,
};
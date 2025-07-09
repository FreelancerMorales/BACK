const { log } = require("console");
const prisma = require("../prismaClient");
const { answerOk, answerError } = require("../utils/answers");

// GET /cuentas
const obtenerCuentas = async (req, res) => {
  const { tipo, activo, limit, page } = req.query;
  const limitNum = parseInt(limit) || 50;
  const pageNum = parseInt(page) || 1;
  const skip = (pageNum - 1) * limitNum;
  

  try {
    const where = {
      usuarioId: req.usuario.id,
      activo: activo !== undefined ? activo === "true" : true,
      ...(tipo && { tipo }),
    };

    const cuentas = await prisma.cuenta.findMany({
      where,
      orderBy: { nombre: "asc" },
      skip,
      take: limitNum,
      include: {
        _count: {
          select: { transacciones: true },
        },
      },
    });

    const total = await prisma.cuenta.count({ where });

    return answerOk(
      res,
      {
        cuentas,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
      "Cuentas obtenidas correctamente"
    );
  } catch (error) {
    console.error(
      `obtenerCuentas: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener las cuentas");
  }
};

// GET /cuentas/:id
const obtenerCuentaPorId = async (req, res) => {
  const cuentaId = parseInt(req.params.id);

  if (isNaN(cuentaId)) {
    return answerError(res, "ID de cuenta inválido", 400);
  }

  try {
    const cuenta = await prisma.cuenta.findUnique({
      where: { id: cuentaId },
      include: {
        _count: {
          select: { transacciones: true },
        },
      },
    });

    if (!cuenta || cuenta.usuarioId !== req.usuario.id) {
      return answerError(res, "Cuenta no encontrada", 404);
    }

    return answerOk(res, cuenta, "Cuenta obtenida correctamente");
  } catch (error) {
    console.error(
      `obtenerCuentaPorId: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener la cuenta");
  }
};

// GET /cuentas/:id/saldo
const obtenerSaldoCuenta = async (req, res) => {
  const cuentaId = parseInt(req.params.id);
  
  try {
    const cuenta = await prisma.cuenta.findUnique({
      where: { id: cuentaId },
      include: {
        transacciones: {
          where: { usuarioId: req.usuario.id },
          include: { tipoMovimiento: true },
        },
      },
    });

    if (!cuenta || cuenta.usuarioId !== req.usuario.id) {
      return answerError(res, "Cuenta no encontrada", 404);
    }

    // Cálculo optimizado del saldo
    const montoInicial = cuenta.montoInicial || 0;
    let totalIngresos = 0;
    let totalEgresos = 0;

    cuenta.transacciones.forEach((tx) => {
      if (tx.tipoMovimiento.nombre === "Ingreso") {
        totalIngresos += tx.monto;
      } else if (tx.tipoMovimiento.nombre === "Egreso") {
        totalEgresos += tx.monto;
      }
    });

    const saldo = montoInicial + totalIngresos - totalEgresos;

    return answerOk(res, {
      saldo: parseFloat(saldo.toFixed(2)),
      montoInicial: parseFloat(montoInicial.toFixed(2)),
      totalIngresos: parseFloat(totalIngresos.toFixed(2)),
      totalEgresos: parseFloat(totalEgresos.toFixed(2)),
      totalTransacciones: cuenta.transacciones.length,
    }, "Saldo de la cuenta obtenido");
  } catch (error) {
    console.error(`obtenerSaldoCuenta: Error para usuario ${req.usuario.id}:`, error);
    return answerError(res, "Error al calcular el saldo");
  }
};

// GET /cuentas/:id/resumen
const obtenerResumenCuenta = async (req, res) => {
  const cuentaId = parseInt(req.params.id);
  const { fechaInicio, fechaFin } = req.query;

  if (isNaN(cuentaId)) {
    return answerError(res, "ID de cuenta inválido", 400);
  }

  try {
    const cuenta = await prisma.cuenta.findUnique({
      where: { id: cuentaId },
    });

    if (!cuenta || cuenta.usuarioId !== req.usuario.id) {
      return answerError(res, "Cuenta no encontrada", 404);
    }

    // Construir filtros de fecha
    const fechaFiltro = {};
    if (fechaInicio) fechaFiltro.gte = new Date(fechaInicio);
    if (fechaFin) fechaFiltro.lte = new Date(fechaFin);

    const whereTransacciones = {
      cuentaId,
      usuarioId: req.usuario.id,
      ...(Object.keys(fechaFiltro).length > 0 && { fecha: fechaFiltro }),
    };

    // Obtener estadísticas agregadas
    const resumen = await prisma.transaccion.groupBy({
      by: ["tipoMovimientoId"],
      where: whereTransacciones,
      _sum: { monto: true },
      _count: { id: true },
    });

    // Obtener nombres de tipos de movimiento
    const tiposMovimiento = await prisma.tipoMovimiento.findMany();
    const tipoMap = Object.fromEntries(
      tiposMovimiento.map((t) => [t.id, t.nombre])
    );

    const resumenFormateado = resumen.map((r) => ({
      tipo: tipoMap[r.tipoMovimientoId],
      totalMonto: parseFloat((r._sum.monto || 0).toFixed(2)),
      totalTransacciones: r._count.id,
    }));

    return answerOk(res, resumenFormateado, "Resumen de cuenta obtenido");
  } catch (error) {
    console.error(
      `obtenerResumenCuenta: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "Error al obtener el resumen");
  }
};

// POST /cuentas
const crearCuenta = async (req, res) => {
  const { nombre, tipo, color, montoInicial } = req.body;

  try {
    // Validar si ya existe una cuenta con el mismo nombre para el usuario
    const cuentaExistente = await prisma.cuenta.findFirst({
      where: {
        nombre,
        usuarioId: req.usuario.id,
        activo: true,
      },
    });

    if (cuentaExistente) {
      return answerError(res, "Ya existe una cuenta con este nombre", 409);
    }

    const nuevaCuenta = await prisma.cuenta.create({
      data: {
        nombre: nombre.trim(),
        tipo,
        color: color || "#6366f1", // Color por defecto
        montoInicial: montoInicial ? parseFloat(montoInicial) : 0,
        usuarioId: req.usuario.id,
      },
    });

    return answerOk(res, nuevaCuenta, "Cuenta creada correctamente", 201);
  } catch (error) {
    console.error(`crearCuenta: Error para usuario ${req.usuario.id}:`, error);
    return answerError(res, "No se pudo crear la cuenta");
  }
};

// PUT /cuentas/:id
const actualizarCuenta = async (req, res) => {
  const cuentaId = parseInt(req.params.id);
  const { nombre, tipo, color, montoInicial } = req.body;

  if (isNaN(cuentaId)) {
    return answerError(res, "ID de cuenta inválido", 400);
  }

  try {
    const cuenta = await prisma.cuenta.findUnique({
      where: { id: cuentaId },
    });

    if (!cuenta || cuenta.usuarioId !== req.usuario.id) {
      return answerError(res, "Cuenta no encontrada", 404);
    }

    if (!cuenta.activo) {
      return answerError(
        res,
        "No se puede actualizar una cuenta inactiva",
        400
      );
    }

    // Validar nombre único si se está cambiando
    if (nombre && nombre !== cuenta.nombre) {
      const cuentaConMismoNombre = await prisma.cuenta.findFirst({
        where: {
          nombre: nombre.trim(),
          usuarioId: req.usuario.id,
          activo: true,
          id: { not: cuentaId },
        },
      });

      if (cuentaConMismoNombre) {
        return answerError(res, "Ya existe una cuenta con este nombre", 409);
      }
    }

    const datosActualizacion = {};
    if (nombre !== undefined) datosActualizacion.nombre = nombre.trim();
    if (tipo !== undefined) datosActualizacion.tipo = tipo;
    if (color !== undefined) datosActualizacion.color = color;
    if (montoInicial !== undefined)
      datosActualizacion.montoInicial = parseFloat(montoInicial);

    const cuentaActualizada = await prisma.cuenta.update({
      where: { id: cuentaId },
      data: datosActualizacion,
    });

    return answerOk(res, cuentaActualizada, "Cuenta actualizada correctamente");
  } catch (error) {
    console.error(
      `actualizarCuenta: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo actualizar la cuenta");
  }
};

// DELETE /cuentas/:id (soft delete)
const eliminarCuenta = async (req, res) => {
  const cuentaId = parseInt(req.params.id);

  if (isNaN(cuentaId)) {
    return answerError(res, "ID de cuenta inválido", 400);
  }

  try {
    const cuenta = await prisma.cuenta.findUnique({
      where: { id: cuentaId },
      include: {
        _count: {
          select: { transacciones: true },
        },
      },
    });

    if (!cuenta || cuenta.usuarioId !== req.usuario.id) {
      return answerError(res, "Cuenta no encontrada", 404);
    }

    if (!cuenta.activo) {
      return answerError(res, "La cuenta ya está inactiva", 400);
    }

    // Advertir si la cuenta tiene transacciones
    if (cuenta._count.transacciones > 0) {
      console.warn(
        `Usuario ${req.usuario.id} eliminando cuenta ${cuentaId} con ${cuenta._count.transacciones} transacciones`
      );
    }

    await prisma.cuenta.update({
      where: { id: cuentaId },
      data: { activo: false },
    });

    return answerOk(
      res,
      {
        mensaje:
          cuenta._count.transacciones > 0
            ? `Cuenta desactivada. Las ${cuenta._count.transacciones} transacciones asociadas se mantuvieron.`
            : "Cuenta desactivada correctamente",
      },
      "Cuenta desactivada correctamente"
    );
  } catch (error) {
    console.error(
      `eliminarCuenta: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo desactivar la cuenta");
  }
};

// PUT /cuentas/:id/reactivar
const reactivarCuenta = async (req, res) => {
  const cuentaId = parseInt(req.params.id);

  if (isNaN(cuentaId)) {
    return answerError(res, "ID de cuenta inválido", 400);
  }

  try {
    const cuenta = await prisma.cuenta.findUnique({
      where: { id: cuentaId },
    });

    if (!cuenta || cuenta.usuarioId !== req.usuario.id) {
      return answerError(res, "Cuenta no encontrada", 404);
    }

    if (cuenta.activo) {
      return answerError(res, "La cuenta ya está activa", 400);
    }

    // Validar nombre único antes de reactivar
    const cuentaConMismoNombre = await prisma.cuenta.findFirst({
      where: {
        nombre: cuenta.nombre,
        usuarioId: req.usuario.id,
        activo: true,
        id: { not: cuentaId },
      },
    });

    if (cuentaConMismoNombre) {
      return answerError(
        res,
        "Ya existe una cuenta activa con este nombre",
        409
      );
    }

    const cuentaReactivada = await prisma.cuenta.update({
      where: { id: cuentaId },
      data: { activo: true },
    });

    return answerOk(res, cuentaReactivada, "Cuenta reactivada correctamente");
  } catch (error) {
    console.error(
      `reactivarCuenta: Error para usuario ${req.usuario.id}:`,
      error
    );
    return answerError(res, "No se pudo reactivar la cuenta");
  }
};

module.exports = {
  obtenerCuentas,
  obtenerCuentaPorId,
  obtenerSaldoCuenta,
  obtenerResumenCuenta,
  crearCuenta,
  actualizarCuenta,
  eliminarCuenta,
  reactivarCuenta,
};
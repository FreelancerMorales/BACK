const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CuentasService {
  // Crear nueva cuenta
  async crear(datos) {
    return await prisma.cuenta.create({
      data: {
        nombre: datos.nombre,
        tipo: datos.tipo,
        color: datos.color,
        montoInicial: datos.montoInicial || 0,
        usuarioId: datos.usuarioId,
        orden: datos.orden || 0,
        saldoActual: datos.montoInicial || 0,
        actualizadoEn: new Date(),
      },
    });
  }

  // Obtener todas las cuentas de un usuario
  async obtenerPorUsuario(usuarioId, opciones = {}) {
    const { activo } = opciones;

    const where = {
      usuarioId,
      ...(activo !== undefined && { activo }),
    };

    return await prisma.cuenta.findMany({
      where,
      orderBy: [{ orden: "asc" }, { creadoEn: "asc" }],
    });
  }

  // Obtener cuenta por ID
  async obtenerPorId(id, usuarioId) {
    return await prisma.cuenta.findFirst({
      where: {
        id: parseInt(id),
        usuarioId,
      },
    });
  }

  // Actualizar cuenta
  async actualizar(id, datos, usuarioId) {
    const cuenta = await prisma.cuenta.findFirst({
      where: { id: parseInt(id), usuarioId },
    });
    if (!cuenta) throw new Error("Cuenta no encontrada");

    return await prisma.cuenta.update({
      where: { id: parseInt(id) },
      data: {
        ...(datos.nombre !== undefined && { nombre: datos.nombre }),
        ...(datos.tipo !== undefined && { tipo: datos.tipo }),
        ...(datos.color !== undefined && { color: datos.color }),
        ...(datos.orden !== undefined && { orden: datos.orden }),
        ...(datos.activo !== undefined && { activo: datos.activo }),
        actualizadoEn: new Date(),
      },
    });
  }

  // Eliminar cuenta (soft delete)
  async eliminar(id, usuarioId) {
    const cuenta = await prisma.cuenta.findFirst({
      where: { id: parseInt(id), usuarioId },
    });
    if (!cuenta) throw new Error("Cuenta no encontrada");

    // Verificar si tiene transacciones
    const tieneTransacciones = await prisma.transaccion.findFirst({
      where: { cuentaId: parseInt(id) },
    });
    if (tieneTransacciones) {
      throw new Error("No se puede eliminar una cuenta con transacciones");
    }

    return await prisma.cuenta.update({
      where: { id: parseInt(id) },
      data: {
        activo: false,
        actualizadoEn: new Date(),
      },
    });
  }

  // Obtener resumen de cuentas
  async obtenerResumen(usuarioId) {
    const cuentas = await this.obtenerPorUsuario(usuarioId, { activo: true });

    const resumen = {
      totalCuentas: cuentas.length,
      saldoTotal: cuentas.reduce(
        (total, cuenta) => total + Number(cuenta.saldoActual),
        0
      ),
      porTipo: {},
    };

    cuentas.forEach((cuenta) => {
      if (!resumen.porTipo[cuenta.tipo]) {
        resumen.porTipo[cuenta.tipo] = {
          cantidad: 0,
          saldo: 0,
        };
      }
      resumen.porTipo[cuenta.tipo].cantidad++;
      resumen.porTipo[cuenta.tipo].saldo += Number(cuenta.saldoActual);
    });

    return { resumen, cuentas };
  }

  // Actualizar orden de cuentas
  async actualizarOrden(usuarioId, ordenCuentas) {
    // Obtener IDs enviados
    const idsEnviados = ordenCuentas.map((item) => parseInt(item.id));

    // Buscar cuentas que pertenecen al usuario y están en la lista
    const cuentasUsuario = await prisma.cuenta.findMany({
      where: {
        usuarioId,
        id: { in: idsEnviados },
        activo: true,
      },
      select: { id: true },
    });

    const idsUsuario = cuentasUsuario.map((c) => c.id);

    // Verificar si todos los IDs enviados pertenecen al usuario
    const idsInvalidos = idsEnviados.filter((id) => !idsUsuario.includes(id));
    if (idsInvalidos.length > 0) {
      throw new Error(
        `Algunos IDs no pertenecen al usuario o no existen: ${idsInvalidos.join(", ")}`
      );
    }

    // Actualizar orden
    return await prisma.$transaction(async (tx) => {
      const actualizaciones = ordenCuentas.map((item, index) =>
        tx.cuenta.update({
          where: { id: parseInt(item.id), usuarioId },
          data: { orden: index, actualizadoEn: new Date() },
        })
      );

      return await Promise.all(actualizaciones);
    });
  }
}

module.exports = new CuentasService();
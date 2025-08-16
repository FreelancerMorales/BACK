const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TipoPagoService {
  // Crear nuevo tipo de pago
  async crear(datos) {
    return await prisma.tipopago.create({
      data: {
        nombre: datos.nombre,
        descripcion: datos.descripcion,
        orden: datos.orden || 0,
        requiereReferencia: datos.requiereReferencia || false,
        activo: datos.activo ?? true,
      },
    });
  }

  // Obtener todos los tipos de pago activos
  async obtenerTodos() {
    return await prisma.tipopago.findMany({
      where: { activo: true },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    });
  }

  // Obtener tipo de pago por ID
  async obtenerPorId(id) {
    return await prisma.tipopago.findUnique({
      where: { id: parseInt(id) },
    });
  }

  // Actualizar tipo de pago
  async actualizar(id, datos) {
    const tipoPago = await prisma.tipopago.findUnique({
      where: { id: parseInt(id) },
    });
    if (!tipoPago) throw new Error("Tipo de pago no encontrado");

    return await prisma.tipopago.update({
      where: { id: parseInt(id) },
      data: {
        ...(datos.nombre !== undefined && { nombre: datos.nombre }),
        ...(datos.descripcion !== undefined && {
          descripcion: datos.descripcion,
        }),
        ...(datos.orden !== undefined && { orden: datos.orden }),
        ...(datos.requiereReferencia !== undefined && {
          requiereReferencia: datos.requiereReferencia,
        }),
        ...(datos.activo !== undefined && { activo: datos.activo }),
      },
    });
  }

  // Eliminar tipo de pago (soft delete)
  async eliminar(id) {
    const tipoPago = await prisma.tipopago.findUnique({
      where: { id: parseInt(id) },
    });
    if (!tipoPago) throw new Error("Tipo de pago no encontrado");

    return await prisma.tipopago.update({
      where: { id: parseInt(id) },
      data: { activo: false },
    });
  }

  // Reactivar tipo de pago (soft restore)
  async reactivar(id) {
    const tipoPago = await prisma.tipopago.findUnique({
      where: { id: parseInt(id) },
    });
    if (!tipoPago) throw new Error("Tipo de pago no encontrado");
    if (tipoPago.activo) throw new Error("El tipo de pago ya está activo");

    return await prisma.tipopago.update({
      where: { id: parseInt(id) },
      data: { activo: true },
    });
  }

  // Obtener tipos de pago con estadísticas de uso
  async obtenerConEstadisticas() {
    const tiposPago = await prisma.tipopago.findMany({
      where: { activo: true },
      include: {
        _count: {
          select: {
            transaccion: true,
            proyeccion: true,
          },
        },
      },
      orderBy: [{ orden: "asc" }, { nombre: "asc" }],
    });

    return tiposPago.map((tipoPago) => ({
      ...tipoPago,
      totalUso: tipoPago._count.transaccion + tipoPago._count.proyeccion,
    }));
  }
}

module.exports = new TipoPagoService();

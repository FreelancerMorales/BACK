const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // 1. Limpiar datos existentes (en orden inverso por FK)
  await prisma.etiquetaOnTransaccion.deleteMany({});
  await prisma.transaccion.deleteMany({});
  await prisma.proyeccion.deleteMany({});
  await prisma.etiqueta.deleteMany({});
  await prisma.usuarioCategoria.deleteMany({});
  await prisma.cuenta.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.categoriaBase.deleteMany({});
  await prisma.tipoMovimiento.deleteMany({});
  await prisma.tipoPago.deleteMany({});
  await prisma.color.deleteMany({});
  await prisma.icono.deleteMany({});

  console.log("🧹 Datos anteriores limpiados");

  // 2. Iconos básicos
  const iconos = await prisma.icono.createMany({
    data: [
      {
        nombre: "Dinero",
        codigo: "fas fa-money-bill-wave",
        categoria: "finanzas",
      },
      { nombre: "Comida", codigo: "fas fa-utensils", categoria: "gastos" },
      { nombre: "Transporte", codigo: "fas fa-car", categoria: "gastos" },
      { nombre: "Casa", codigo: "fas fa-home", categoria: "gastos" },
      { nombre: "Trabajo", codigo: "fas fa-briefcase", categoria: "ingresos" },
    ],
  });

  // 3. Colores básicos
  const colores = await prisma.color.createMany({
    data: [
      { nombre: "Verde", hex: "#10B981" },
      { nombre: "Azul", hex: "#3B82F6" },
      { nombre: "Rojo", hex: "#EF4444" },
      { nombre: "Amarillo", hex: "#F59E0B" },
      { nombre: "Púrpura", hex: "#8B5CF6" },
    ],
  });

  // 4. Tipos de movimiento
  const tipoIngreso = await prisma.tipoMovimiento.create({
    data: {
      nombre: "Ingreso",
      descripcion: "Entrada de dinero",
      transferencia: false,
    },
  });

  const tipoEgreso = await prisma.tipoMovimiento.create({
    data: {
      nombre: "Egreso",
      descripcion: "Salida de dinero",
      transferencia: false,
    },
  });

  const tipoTransferencia = await prisma.tipoMovimiento.create({
    data: {
      nombre: "Transferencia",
      descripcion: "Movimiento entre cuentas",
      transferencia: true,
    },
  });

  // 5. Tipos de pago
  const tipoPagos = await prisma.tipoPago.createMany({
    data: [
      { nombre: "Efectivo", descripcion: "Pago en efectivo", orden: 1 },
      { nombre: "Débito", descripcion: "Tarjeta de débito", orden: 2 },
      {
        nombre: "Crédito",
        descripcion: "Tarjeta de crédito",
        requiereReferencia: true,
        orden: 3,
      },
    ],
  });

  // Obtener IDs creados
  const iconosCreados = await prisma.icono.findMany({ take: 5 });
  const coloresCreados = await prisma.color.findMany({ take: 5 });

  // 6. Categorías base principales
  const categoriaSalario = await prisma.categoriaBase.create({
    data: {
      nombre: "Salario",
      descripcion: "Ingresos por trabajo",
      orden: 1,
      nivel: 0,
      iconoId: iconosCreados[4].id, // Trabajo
      colorId: coloresCreados[0].id, // Verde
      tipoMovimientoId: tipoIngreso.id,
    },
  });

  const categoriaAlimentos = await prisma.categoriaBase.create({
    data: {
      nombre: "Alimentación",
      descripcion: "Gastos en comida y bebidas",
      orden: 1,
      nivel: 0,
      iconoId: iconosCreados[1].id, // Comida
      colorId: coloresCreados[2].id, // Rojo
      tipoMovimientoId: tipoEgreso.id,
    },
  });

  const categoriaTransporte = await prisma.categoriaBase.create({
    data: {
      nombre: "Transporte",
      descripcion: "Gastos de movilidad",
      orden: 2,
      nivel: 0,
      iconoId: iconosCreados[2].id, // Transporte
      colorId: coloresCreados[1].id, // Azul
      tipoMovimientoId: tipoEgreso.id,
    },
  });

  // 7. Subcategoría ejemplo
  const subcategoriaRestaurantes = await prisma.categoriaBase.create({
    data: {
      nombre: "Restaurantes",
      descripcion: "Comidas fuera de casa",
      orden: 1,
      nivel: 1,
      esSubcategoria: true,
      padreId: categoriaAlimentos.id,
      iconoId: iconosCreados[1].id,
      colorId: coloresCreados[2].id,
      tipoMovimientoId: tipoEgreso.id,
    },
  });

  // 8. Usuario de prueba
  const usuario = await prisma.usuario.create({
    data: {
      id: "google_123456789",
      nombre: "Usuario Demo",
      correo: "demo@ejemplo.com",
      foto: "https://via.placeholder.com/150",
    },
  });

  // 9. Cuentas del usuario
  const cuentaCorriente = await prisma.cuenta.create({
    data: {
      nombre: "Cuenta Corriente",
      tipo: "CORRIENTE",
      color: "#3B82F6",
      montoInicial: 1000.0,
      saldoActual: 1000.0,
      orden: 1,
      usuarioId: usuario.id,
    },
  });

  const cuentaAhorros = await prisma.cuenta.create({
    data: {
      nombre: "Cuenta Ahorros",
      tipo: "AHORROS",
      color: "#10B981",
      montoInicial: 5000.0,
      saldoActual: 5000.0,
      orden: 2,
      usuarioId: usuario.id,
    },
  });

  // 10. Asignar categorías al usuario
  const usuarioCatSalario = await prisma.usuarioCategoria.create({
    data: {
      usuarioId: usuario.id,
      categoriaBaseId: categoriaSalario.id,
      tipoMovimientoId: tipoIngreso.id,
    },
  });

  const usuarioCatAlimentos = await prisma.usuarioCategoria.create({
    data: {
      usuarioId: usuario.id,
      categoriaBaseId: categoriaAlimentos.id,
      tipoMovimientoId: tipoEgreso.id,
    },
  });

  const usuarioCatTransporte = await prisma.usuarioCategoria.create({
    data: {
      usuarioId: usuario.id,
      categoriaBaseId: categoriaTransporte.id,
      tipoMovimientoId: tipoEgreso.id,
    },
  });

  // 11. Etiquetas del usuario
  const etiquetaUrgente = await prisma.etiqueta.create({
    data: {
      nombre: "Urgente",
      color: "#EF4444",
      descripcion: "Gastos urgentes e inesperados",
      usuarioId: usuario.id,
    },
  });

  // 12. Transacciones de ejemplo
  const tipoPagoEfectivo = await prisma.tipoPago.findFirst({
    where: { nombre: "Efectivo" },
  });

  const transaccionSalario = await prisma.transaccion.create({
    data: {
      monto: 3000.0,
      descripcion: "Salario mensual enero",
      fecha: new Date("2025-01-01"),
      cuentaId: cuentaCorriente.id,
      usuarioCategoriaId: usuarioCatSalario.id,
      tipoMovimientoId: tipoIngreso.id,
      usuarioId: usuario.id,
      tipoPagoId: tipoPagoEfectivo.id,
    },
  });

  const transaccionSupermercado = await prisma.transaccion.create({
    data: {
      monto: 150.5,
      descripcion: "Compras supermercado",
      fecha: new Date("2025-01-15"),
      notas: "Compras de la quincena",
      cuentaId: cuentaCorriente.id,
      usuarioCategoriaId: usuarioCatAlimentos.id,
      tipoMovimientoId: tipoEgreso.id,
      usuarioId: usuario.id,
      tipoPagoId: tipoPagoEfectivo.id,
    },
  });

  // 13. Asignar etiqueta a transacción
  await prisma.etiquetaOnTransaccion.create({
    data: {
      transaccionId: transaccionSupermercado.id,
      etiquetaId: etiquetaUrgente.id,
    },
  });

  // 14. Proyección de ejemplo
  const proyeccionRenta = await prisma.proyeccion.create({
    data: {
      titulo: "Pago de Renta",
      descripcion: "Pago mensual de alquiler",
      monto: 800.0,
      fecha: new Date("2025-02-01"),
      recurrente: true,
      frecuencia: "mensual",
      proximaFecha: new Date("2025-03-01"),
      diasNotificacion: 3,
      cuentaId: cuentaCorriente.id,
      usuarioCategoriaId: usuarioCatTransporte.id, // Usando transporte como ejemplo
      tipoMovimientoId: tipoEgreso.id,
      usuarioId: usuario.id,
    },
  });

  // Actualizar saldos después de transacciones
  await prisma.cuenta.update({
    where: { id: cuentaCorriente.id },
    data: { saldoActual: 3000.0 - 150.5 + 1000.0 }, // saldo inicial + ingreso - egreso
  });

  console.log("✅ Seed completado exitosamente!");
  console.log(`
📊 Datos creados:
- 5 Iconos básicos
- 5 Colores básicos  
- 3 Tipos de movimiento (Ingreso, Egreso, Transferencia)
- 3 Tipos de pago (Efectivo, Débito, Crédito)
- 4 Categorías base (1 con subcategoría)
- 1 Usuario demo (demo@ejemplo.com)
- 2 Cuentas (Corriente y Ahorros)
- 3 Categorías de usuario
- 1 Etiqueta personalizada
- 2 Transacciones de ejemplo
- 1 Proyección recurrente

🔗 Usuario ID: ${usuario.id}
💰 Saldo final cuenta corriente: $${2849.5}
💰 Saldo cuenta ahorros: $${5000.0}
  `);
}

main()
  .then(async () => {
    console.log("🌱 Seed completado exitosamente!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error en seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

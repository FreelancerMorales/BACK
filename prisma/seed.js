const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de HoneyMoney...");

  // Crear usuario "sistema" si no existe
  await prisma.usuario.upsert({
    where: { id: "sistema" },
    update: {},
    create: {
      id: "sistema",
      nombre: "Sistema",
      correo: "sistema@honeymoney.app",
      foto: null,
      activo: true,
    },
  });

  // Tipos de Movimiento
  const tiposMovimiento = ["Ingreso", "Egreso", "Transferencia"];
  for (const nombre of tiposMovimiento) {
    await prisma.tipoMovimiento.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // Tipos de Pago
  const tiposPago = [
    "Efectivo",
    "Tarjeta Débito",
    "Tarjeta Crédito",
    "Transferencia Bancaria",
    "Pago en Cuotas",
  ];
  for (const nombre of tiposPago) {
    await prisma.tipoPago.upsert({
      where: { nombre },
      update: {},
      create: { nombre },
    });
  }

  // Obtener IDs
  const ingreso = await prisma.tipoMovimiento.findUnique({
    where: { nombre: "Ingreso" },
  });
  const egreso = await prisma.tipoMovimiento.findUnique({
    where: { nombre: "Egreso" },
  });

  const usuarioSistema = "sistema";

  // Categorías base
  const categoriasIngreso = [
    { nombre: "Salario", color: "#22c55e", icono: "💼" },
    { nombre: "Ventas", color: "#14b8a6", icono: "🛍️" },
    { nombre: "Reembolsos", color: "#3b82f6", icono: "💸" },
    { nombre: "Intereses", color: "#7c3aed", icono: "📈" },
  ];

  const categoriasEgreso = [
    {
      nombre: "Comida",
      color: "#f87171",
      icono: "🍔",
      subcategorias: ["Restaurante", "Supermercado", "Snacks"],
    },
    {
      nombre: "Transporte",
      color: "#60a5fa",
      icono: "🚗",
      subcategorias: ["Combustible", "Taxi", "Mantenimiento"],
    },
    {
      nombre: "Hogar",
      color: "#fbbf24",
      icono: "🏠",
      subcategorias: ["Renta", "Servicios", "Mobiliario"],
    },
    {
      nombre: "Salud",
      color: "#f472b6",
      icono: "🩺",
      subcategorias: ["Medicinas", "Consultas"],
    },
    {
      nombre: "Educación",
      color: "#34d399",
      icono: "📚",
      subcategorias: ["Universidad", "Cursos"],
    },
    {
      nombre: "Entretenimiento",
      color: "#a78bfa",
      icono: "🎮",
      subcategorias: ["Cine", "Suscripciones", "Viajes"],
    },
    {
      nombre: "Compras",
      color: "#fb923c",
      icono: "🛒",
      subcategorias: ["Ropa", "Tecnología", "Regalos"],
    },
  ];

  // Crear categorías de ingreso
  for (const cat of categoriasIngreso) {
    await prisma.categoria.upsert({
      where: {
        nombre_usuarioId: {
          nombre: cat.nombre,
          usuarioId: usuarioSistema,
        },
      },
      update: {},
      create: {
        nombre: cat.nombre,
        icono: cat.icono,
        color: cat.color,
        tipoMovimientoId: ingreso.id,
        usuarioId: usuarioSistema,
      },
    });
  }

  // Crear categorías de egreso + subcategorías
  for (const cat of categoriasEgreso) {
    const padre = await prisma.categoria.upsert({
      where: {
        nombre_usuarioId: {
          nombre: cat.nombre,
          usuarioId: usuarioSistema,
        },
      },
      update: {},
      create: {
        nombre: cat.nombre,
        icono: cat.icono,
        color: cat.color,
        tipoMovimientoId: egreso.id,
        usuarioId: usuarioSistema,
      },
    });

    for (const sub of cat.subcategorias) {
      await prisma.categoria.upsert({
        where: {
          nombre_usuarioId: {
            nombre: `${cat.nombre} > ${sub}`,
            usuarioId: usuarioSistema,
          },
        },
        update: {},
        create: {
          nombre: `${cat.nombre} > ${sub}`,
          color: cat.color,
          tipoMovimientoId: egreso.id,
          usuarioId: usuarioSistema,
          padreId: padre.id,
        },
      });
    }
  }

  console.log("✅ Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error("❌ Error durante el seed:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
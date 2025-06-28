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

  // Categorías base de ingreso
  const categoriasIngreso = [
    { nombre: "Salario", color: "#22c55e", icono: "FaBriefcase" },
    { nombre: "Ventas", color: "#14b8a6", icono: "FaShoppingBag" },
    { nombre: "Reembolsos", color: "#3b82f6", icono: "FaMoneyBillWave" },
    { nombre: "Intereses", color: "#7c3aed", icono: "FaChartLine" },
    { nombre: "Premios", color: "#16a34a", icono: "FaAward" },
    { nombre: "Regalos Recibidos", color: "#0ea5e9", icono: "FaGift" },
    { nombre: "Alquiler Recibido", color: "#0d9488", icono: "FaHome" },
  ];

  // Categorías base de egreso con subcategorías
  const categoriasEgreso = [
    {
      nombre: "Comida",
      color: "#f87171",
      icono: "FaUtensils",
      subcategorias: [
        "Restaurante",
        "Supermercado",
        "Snacks",
        "Bebidas",
        "Desayunos",
      ],
    },
    {
      nombre: "Transporte",
      color: "#60a5fa",
      icono: "FaCar",
      subcategorias: [
        "Combustible",
        "Taxi",
        "Mantenimiento",
        "Parqueo",
        "Transporte Público",
      ],
    },
    {
      nombre: "Hogar",
      color: "#fbbf24",
      icono: "FaHome",
      subcategorias: [
        "Renta",
        "Servicios (agua, luz, etc.)",
        "Mobiliario",
        "Reparaciones",
        "Internet/Cable",
      ],
    },
    {
      nombre: "Salud",
      color: "#f472b6",
      icono: "FaHeartbeat",
      subcategorias: ["Medicinas", "Consultas", "Seguro Médico", "Dentista"],
    },
    {
      nombre: "Educación",
      color: "#34d399",
      icono: "FaBook",
      subcategorias: ["Universidad", "Cursos", "Materiales", "Libros"],
    },
    {
      nombre: "Entretenimiento",
      color: "#a78bfa",
      icono: "FaGamepad",
      subcategorias: [
        "Cine",
        "Suscripciones (Netflix, etc.)",
        "Viajes",
        "Eventos",
        "Juegos",
      ],
    },
    {
      nombre: "Compras",
      color: "#fb923c",
      icono: "FaShoppingCart",
      subcategorias: [
        "Ropa",
        "Tecnología",
        "Regalos",
        "Electrodomésticos",
        "Decoración",
      ],
    },
    {
      nombre: "Mascotas",
      color: "#facc15",
      icono: "FaPaw",
      subcategorias: ["Alimentos", "Veterinario", "Juguetes", "Baño/Cuidado"],
    },
    {
      nombre: "Finanzas",
      color: "#94a3b8",
      icono: "FaWallet",
      subcategorias: [
        "Pagos Tarjeta Crédito",
        "Préstamos",
        "Intereses",
        "Ahorro",
      ],
    },
    {
      nombre: "Donaciones",
      color: "#10b981",
      icono: "FaHandHoldingHeart",
      subcategorias: ["Iglesia", "ONGs", "Ayuda a Familia/Amigos"],
    },
    {
      nombre: "Otros",
      color: "#cbd5e1",
      icono: "FaEllipsisH",
      subcategorias: ["Varios", "Imprevistos", "Multas", "Cargos Bancarios"],
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
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Clona categorías y subcategorías desde usuario "sistema" al nuevo usuario.
 * Mantiene relaciones padre-hijo.
 */
async function clonarCategoriasDesdeSistema(nuevoUsuarioId) {
  // Traer todas las categorías del sistema con sus subcategorías
  const categoriasSistema = await prisma.categoria.findMany({
    where: { usuarioId: "sistema" },
    orderBy: { id: "asc" }, // para asegurar orden
  });

  const mapaIdNuevo = {};

  // Primero crear categorías padre (sin padreId)
  for (const cat of categoriasSistema.filter((c) => !c.padreId)) {
    const nueva = await prisma.categoria.create({
      data: {
        nombre: cat.nombre,
        icono: cat.icono,
        color: cat.color,
        tipoMovimientoId: cat.tipoMovimientoId,
        usuarioId: nuevoUsuarioId,
      },
    });
    mapaIdNuevo[cat.id] = nueva.id;
  }

  // Luego crear subcategorías con padreId apuntando a los nuevos IDs
  for (const cat of categoriasSistema.filter((c) => c.padreId)) {
    const nueva = await prisma.categoria.create({
      data: {
        nombre: cat.nombre,
        icono: cat.icono,
        color: cat.color,
        tipoMovimientoId: cat.tipoMovimientoId,
        usuarioId: nuevoUsuarioId,
        padreId: mapaIdNuevo[cat.padreId],
      },
    });
    mapaIdNuevo[cat.id] = nueva.id;
  }
}

module.exports = clonarCategoriasDesdeSistema;
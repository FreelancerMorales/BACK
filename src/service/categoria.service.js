const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CategoriaService {
  // Obtener todas las categorías base activas
  async obtenerCategoriasBase(tipoMovimientoId = null) {
    const where = {
      activo: true,
      ...(tipoMovimientoId && { tipoMovimientoId }),
    };

    return await prisma.categoriabase.findMany({
      where,
      include: {
        icono: true,
        color: true,
        tipomovimiento: true,
        categoriabase: {
          // Padre
          include: {
            icono: true,
            color: true,
          },
        },
        other_categoriabase: {
          // Hijos/subcategorías
          where: { activo: true },
          include: {
            icono: true,
            color: true,
          },
          orderBy: { orden: "asc" },
        },
      },
      orderBy: [{ nivel: "asc" }, { orden: "asc" }],
    });
  }

  // Obtener categorías del usuario (ya asignadas)
  async obtenerCategoriasUsuario(usuarioId, tipoMovimientoId = null) {
    const where = {
      usuarioId,
      activo: true,
      ...(tipoMovimientoId && { tipoMovimientoId }),
    };

    return await prisma.usuariocategoria.findMany({
      where,
      include: {
        categoriabase: {
          include: {
            icono: true,
            color: true,
            categoriabase: {
              // Padre
              include: {
                icono: true,
                color: true,
              },
            },
            other_categoriabase: {
              // Hijos
              where: { activo: true },
              include: {
                icono: true,
                color: true,
              },
              orderBy: { orden: "asc" },
            },
          },
        },
        tipomovimiento: true,
      },
      orderBy: {
        categoriabase: {
          orden: "asc",
        },
      },
    });
  }

  // Asignar categoría base a usuario
  async asignarCategoriaAUsuario(usuarioId, categoriaBaseId, tipoMovimientoId) {
    // Verificar que la categoría base existe y está activa
    const categoriaBase = await prisma.categoriabase.findFirst({
      where: {
        id: categoriaBaseId,
        activo: true,
      },
    });
    if (!categoriaBase) {
      throw new Error("La categoría base no existe o no está activa");
    }

    // Verificar que el tipo de movimiento existe
    const tipoMovimiento = await prisma.tipomovimiento.findFirst({
      where: {
        id: tipoMovimientoId,
        activo: true,
      },
    });
    if (!tipoMovimiento) {
      throw new Error("El tipo de movimiento no existe o no está activo");
    }

    // Crear la relación usuario-categoría
    const usuarioCategoria = await prisma.usuariocategoria.create({
      data: {
        usuarioId,
        categoriaBaseId,
        tipoMovimientoId,
      },
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

    return usuarioCategoria;
  }

  // Desactivar categoría de usuario
  async desactivarCategoriaUsuario(usuarioCategoriaId, usuarioId) {
    const usuarioCategoria = await prisma.usuariocategoria.findFirst({
      where: {
        id: usuarioCategoriaId,
        usuarioId,
      },
    });
    if (!usuarioCategoria) {
      throw new Error(
        "La categoría de usuario no existe o no pertenece al usuario"
      );
    }

    return await prisma.usuariocategoria.update({
      where: {
        id: usuarioCategoriaId,
      },
      data: {
        activo: false,
      },
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

  // Reactivar categoría de usuario
  async reactivarCategoriaUsuario(usuarioCategoriaId, usuarioId) {
    const usuarioCategoria = await prisma.usuariocategoria.findFirst({
      where: {
        id: usuarioCategoriaId,
        usuarioId,
      },
    });
    if (!usuarioCategoria) {
      throw new Error(
        "La categoría de usuario no existe o no pertenece al usuario"
      );
    }

    return await prisma.usuariocategoria.update({
      where: {
        id: usuarioCategoriaId,
      },
      data: {
        activo: true,
      },
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

  // Obtener categoría de usuario por ID
  async obtenerCategoriaUsuarioPorId(usuarioCategoriaId, usuarioId) {
    return await prisma.usuariocategoria.findFirst({
      where: {
        id: usuarioCategoriaId,
        usuarioId,
      },
      include: {
        categoriabase: {
          include: {
            icono: true,
            color: true,
            categoriabase: {
              // Padre
              include: {
                icono: true,
                color: true,
              },
            },
          },
        },
        tipomovimiento: true,
      },
    });
  }

  // Obtener categorías base jerárquicas (padres con sus hijos)
  async obtenerCategoriasJerarquicas(tipoMovimientoId = null) {
    const where = {
      activo: true,
      padreId: null, // Solo categorías padre
      ...(tipoMovimientoId && { tipoMovimientoId }),
    };

    return await prisma.categoriabase.findMany({
      where,
      include: {
        icono: true,
        color: true,
        tipomovimiento: true,
        other_categoriabase: {
          // Subcategorías
          where: {
            activo: true,
            esSubcategoria: true,
          },
          include: {
            icono: true,
            color: true,
          },
          orderBy: { orden: "asc" },
        },
      },
      orderBy: { orden: "asc" },
    });
  }

  // Obtener iconos disponibles
  async obtenerIconos(categoria = null) {
    const where = {
      activo: true,
      ...(categoria && { categoria }),
    };

    return await prisma.icono.findMany({
      where,
      orderBy: [{ categoria: "asc" }, { nombre: "asc" }],
    });
  }

  // Obtener colores disponibles
  async obtenerColores() {
    return await prisma.color.findMany({
      where: {
        activo: true,
      },
      orderBy: { nombre: "asc" },
    });
  }

  // Obtener tipos de movimiento disponibles
  async obtenerTiposMovimiento() {
    return await prisma.tipomovimiento.findMany({
      where: {
        activo: true,
      },
      orderBy: { nombre: "asc" },
    });
  }
}

module.exports = new CategoriaService();
const categoriaService = require("../service/categoria.service");
const { answerOk, answerError } = require("../utils/answers");

class CategoriaController {
  // GET /categorias/base - Obtener todas las categorías base disponibles
  async obtenerCategoriasBase(req, res) {
    try {
      const tipoMovimientoId = req.query.tipoMovimientoId
        ? parseInt(req.query.tipoMovimientoId)
        : null;

      const categorias = await categoriaService.obtenerCategoriasBase(
        tipoMovimientoId
      );

      return answerOk(
        res,
        categorias,
        "Categorías base obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener categorías base:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /categorias/jerarquicas - Obtener categorías base con estructura jerárquica
  async obtenerCategoriasJerarquicas(req, res) {
    try {
      const tipoMovimientoId = req.query.tipoMovimientoId
        ? parseInt(req.query.tipoMovimientoId)
        : null;

      const categorias = await categoriaService.obtenerCategoriasJerarquicas(
        tipoMovimientoId
      );

      return answerOk(
        res,
        categorias,
        "Categorías jerárquicas obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener categorías jerárquicas:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /categorias/usuario - Obtener categorías del usuario
  async obtenerCategoriasUsuario(req, res) {
    try {
      const tipoMovimientoId = req.query.tipoMovimientoId
        ? parseInt(req.query.tipoMovimientoId)
        : null;

      const categorias = await categoriaService.obtenerCategoriasUsuario(
        req.usuario.id,
        tipoMovimientoId
      );

      return answerOk(
        res,
        categorias,
        "Categorías de usuario obtenidas exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener categorías de usuario:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /categorias/usuario/:id - Obtener categoría de usuario por ID
  async obtenerCategoriaUsuarioPorId(req, res) {
    try {
      const categoria = await categoriaService.obtenerCategoriaUsuarioPorId(
        parseInt(req.params.id),
        req.usuario.id
      );

      if (!categoria) {
        return answerError(res, "Categoría de usuario no encontrada", 404);
      }

      return answerOk(
        res,
        categoria,
        "Categoría de usuario obtenida exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener categoría de usuario:", error);
      return answerError(res, error.message, 400);
    }
  }

  // POST /categorias/usuario - Asignar categoría base a usuario
  async asignarCategoriaAUsuario(req, res) {
    try {
      const { categoriaBaseId, tipoMovimientoId } = req.body;

      const usuarioCategoria = await categoriaService.asignarCategoriaAUsuario(
        req.usuario.id,
        categoriaBaseId,
        tipoMovimientoId
      );

      return answerOk(
        res,
        usuarioCategoria,
        "Categoría asignada exitosamente",
        201
      );
    } catch (error) {
      console.error("Error al asignar categoría:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PATCH /categorias/usuario/:id/desactivar - Desactivar categoría de usuario
  async desactivarCategoriaUsuario(req, res) {
    try {
      const usuarioCategoria =
        await categoriaService.desactivarCategoriaUsuario(
          parseInt(req.params.id),
          req.usuario.id
        );

      return answerOk(
        res,
        usuarioCategoria,
        "Categoría desactivada exitosamente"
      );
    } catch (error) {
      console.error("Error al desactivar categoría:", error);
      return answerError(res, error.message, 400);
    }
  }

  // PATCH /categorias/usuario/:id/reactivar - Reactivar categoría de usuario
  async reactivarCategoriaUsuario(req, res) {
    try {
      const usuarioCategoria = await categoriaService.reactivarCategoriaUsuario(
        parseInt(req.params.id),
        req.usuario.id
      );

      return answerOk(
        res,
        usuarioCategoria,
        "Categoría reactivada exitosamente"
      );
    } catch (error) {
      console.error("Error al reactivar categoría:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /categorias/iconos - Obtener iconos disponibles
  async obtenerIconos(req, res) {
    try {
      const categoria = req.query.categoria || null;

      const iconos = await categoriaService.obtenerIconos(categoria);

      return answerOk(res, iconos, "Iconos obtenidos exitosamente");
    } catch (error) {
      console.error("Error al obtener iconos:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /categorias/colores - Obtener colores disponibles
  async obtenerColores(req, res) {
    try {
      const colores = await categoriaService.obtenerColores();

      return answerOk(res, colores, "Colores obtenidos exitosamente");
    } catch (error) {
      console.error("Error al obtener colores:", error);
      return answerError(res, error.message, 400);
    }
  }

  // GET /categorias/tipos-movimiento - Obtener tipos de movimiento disponibles
  async obtenerTiposMovimiento(req, res) {
    try {
      const tiposMovimiento = await categoriaService.obtenerTiposMovimiento();

      return answerOk(
        res,
        tiposMovimiento,
        "Tipos de movimiento obtenidos exitosamente"
      );
    } catch (error) {
      console.error("Error al obtener tipos de movimiento:", error);
      return answerError(res, error.message, 400);
    }
  }
}

module.exports = new CategoriaController();
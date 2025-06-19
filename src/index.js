const express = require("express");
const cors = require("cors");
const usuarioRoutes = require("./routes/usuario.routes");
const cuentaRoutes = require("./routes/cuenta.routes");
const categoriaRoutes = require("./routes/categoria.routes");
const tipoMovimientoRoutes = require("./routes/tipoMovimiento.routes");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/usuarios", usuarioRoutes);

app.use("/cuentas", cuentaRoutes);

app.use("/categorias", categoriaRoutes);

app.use("/tipos-movimiento", tipoMovimientoRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
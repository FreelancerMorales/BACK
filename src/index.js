require("dotenv").config();
const express = require("express");
const cors = require("cors");
const usuarioRoutes = require("./routes/usuario.routes");
const cuentaRoutes = require("./routes/cuentas.routes");
const categoriaRoutes = require("./routes/categoria.routes");
const tipoMovimientoRoutes = require("./routes/tipoMovimiento.routes");
const transaccionRoutes = require("./routes/transaccion.routes");
const autenticarGoogle = require("./middlewares/authGoogle");
const handlingError = require("./middlewares/handlingError");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas protegidas
app.use("/usuarios", usuarioRoutes);
app.use("/cuentas", autenticarGoogle, cuentaRoutes);
app.use("/categorias", autenticarGoogle, categoriaRoutes);
app.use("/tipos-movimiento", autenticarGoogle, tipoMovimientoRoutes);
app.use("/transacciones", autenticarGoogle, transaccionRoutes);

// Manejo global de errores
app.use(handlingError);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

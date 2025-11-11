require("dotenv").config();
const express = require("express");
const cors = require("cors");
const usuarioRoutes = require("./routes/usuario.routes");
const cuentaRoutes = require("./routes/cuentas.routes");
const categoriaRoutes = require("./routes/categoria.routes");
const tipoMovimientoRoutes = require("./routes/tipoMovimiento.routes");
const tipoPagoRoutes = require("./routes/tipoPago.route");
const etiquetaRoutes = require("./routes/etiquetas.routes");
const proyeccionRoutes = require("./routes/proyeccion.routes");
const reportesRoutes = require("./routes/reportes.routes");
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
app.use("/tipos-pago", autenticarGoogle, tipoPagoRoutes);
app.use("/etiquetas", autenticarGoogle, etiquetaRoutes);
app.use("/proyecciones", autenticarGoogle, proyeccionRoutes);
app.use("/reportes", autenticarGoogle, reportesRoutes);
app.use("/transacciones", autenticarGoogle, transaccionRoutes);

// Manejo global de errores
app.use(handlingError);

const PORT = process.env.PORT || 3001;
const IP = process.env.IP || "0.0.0.0";
app.listen(PORT, IP, () => {
  console.log(`Servidor corriendo en http://${IP}:${PORT}`);
});


const os = require("os");

app.listen(PORT, "0.0.0.0", () => {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  Object.keys(interfaces).forEach((name) => {
    interfaces[name].forEach((net) => {
      if (net.family === "IPv4" && !net.internal) {
        addresses.push(net.address);
      }
    });
  });

  console.log("\n🚀 ================================");
  console.log(`   Servidor iniciado correctamente`);
  console.log("================================");
  console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
  console.log(`🔌 Puerto: ${PORT}`);
  console.log(`🌐 Accesible en:`);
  console.log(`   • Local:   http://localhost:${PORT}`);
  addresses.forEach((addr) => {
    console.log(`   • Red:     http://${addr}:${PORT}`);
  });
  console.log("================================\n");
});
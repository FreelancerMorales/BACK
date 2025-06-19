const express = require("express");
const cors = require("cors");
const usuarioRoutes = require("./routes/usuario.routes");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/usuarios", usuarioRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
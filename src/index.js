const express = require("express");
const cors = require("cors");
const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas (por ahora de prueba)
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Puerto
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const prisma = require("./prismaClient");

app.get("/usuarios", async (req, res) => {
  const usuarios = await prisma.usuario.findMany();
  res.json(usuarios);
});
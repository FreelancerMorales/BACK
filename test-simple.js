const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.json({ mensaje: "¡Funciona!" });
});

const PORT = 3001;
const server = app.listen(PORT, "192.168.1.14", () => {
  console.log(`✅ Test server en http://localhost:${PORT}`);
  console.log(`✅ También en http://192.168.1.14:${PORT}`);
});

server.on("error", (err) => {
  console.error("❌ Error al iniciar servidor:", err);
});

server.off("error", (err) => {
  console.log("✅ Servidor detenido correctamente.");
});

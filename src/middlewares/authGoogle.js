const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const autenticarGoogle = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Token no proporcionado o mal formado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); // Google data
    // payload.sub = ID único de Google
    // payload.email, payload.name, payload.picture

    req.usuario = {
      id: payload.sub,
      nombre: payload.name,
      correo: payload.email,
      foto: payload.picture,
    };

    next();
  } catch (error) {
    console.error("Error al verificar token de Google:", error);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = autenticarGoogle;

const jwt = require("jsonwebtoken");

// Gera um token JWT assinado com o segredo do .env.
// O payload guarda apenas o necessario para identificar o usuario.
function gerarToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
  });
}

// Verifica e decodifica um token. Lanca erro se for invalido ou expirado.
function verificarToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { gerarToken, verificarToken };

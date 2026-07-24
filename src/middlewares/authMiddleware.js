const { verificarToken } = require("../utils/token");

// Middleware de autenticacao.
// Exige um header "Authorization: Bearer <token>" valido.
// Se o token estiver ausente ou invalido/expirado, responde 401.
// Em caso de sucesso, disponibiliza o usuario em req.usuario.
function autenticar(req, res, next) {
  const header = req.headers.authorization || "";
  const [tipo, token] = header.split(" ");

  if (tipo !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ error: "Token de autenticacao nao fornecido." });
  }

  try {
    const payload = verificarToken(token);
    req.usuario = { id: payload.id, nome: payload.nome };
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Token invalido ou expirado." });
  }
}

module.exports = autenticar;

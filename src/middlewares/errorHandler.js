// Middleware central de tratamento de erros.
// Qualquer erro passado via next(err) ou lancado numa rota async
// (com o wrapper) cai aqui, garantindo uma resposta JSON padronizada.
function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const message = err.message || "Erro interno no servidor";

  res.status(status).json({ error: message });
}

module.exports = errorHandler;

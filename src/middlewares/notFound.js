// Middleware executado quando nenhuma rota anterior atendeu a requisicao.
function notFound(req, res, next) {
  res.status(404).json({
    error: "Rota nao encontrada",
    path: req.originalUrl,
  });
}

module.exports = notFound;

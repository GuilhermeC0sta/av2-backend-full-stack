// Envolve controllers assincronos para que qualquer erro (throw ou promise
// rejeitada) seja encaminhado ao middleware central de erros via next(err),
// evitando repetir try/catch em toda rota.
function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;

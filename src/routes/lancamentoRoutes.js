const { Router } = require("express");

const lancamentoController = require("../controllers/lancamentoController");
const autenticar = require("../middlewares/authMiddleware");
const asyncHandler = require("../middlewares/asyncHandler");

const router = Router();

// Todas as rotas de lancamentos exigem autenticacao (JWT).
// O middleware "autenticar" roda antes de qualquer handler abaixo.
router.use(autenticar);

router.get("/", asyncHandler(lancamentoController.listar));
router.get("/:id", asyncHandler(lancamentoController.obter));
router.post("/", asyncHandler(lancamentoController.criar));
router.put("/:id", asyncHandler(lancamentoController.atualizar));
router.delete("/:id", asyncHandler(lancamentoController.remover));

module.exports = router;

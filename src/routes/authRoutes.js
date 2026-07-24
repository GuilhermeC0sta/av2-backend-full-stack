const { Router } = require("express");

const authController = require("../controllers/authController");
const asyncHandler = require("../middlewares/asyncHandler");

const router = Router();

// Rotas publicas de autenticacao (nao exigem token).
router.post("/registrar", asyncHandler(authController.registrar));
router.post("/login", asyncHandler(authController.login));

module.exports = router;

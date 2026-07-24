const bcrypt = require("bcryptjs");

const usuarioModel = require("../models/usuarioModel");
const { gerarToken } = require("../utils/token");

// Valida um email de forma simples.
function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// POST /api/auth/registrar
// Cria um novo usuario, guarda a senha com hash (bcrypt) e ja devolve um token.
async function registrar(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res
      .status(400)
      .json({ error: "Informe nome, email e senha." });
  }

  if (!emailValido(email)) {
    return res.status(400).json({ error: "Email invalido." });
  }

  if (senha.length < 6) {
    return res
      .status(400)
      .json({ error: "A senha deve ter pelo menos 6 caracteres." });
  }

  const jaExiste = await usuarioModel.buscarPorEmail(email);
  if (jaExiste) {
    return res.status(409).json({ error: "Este email ja esta cadastrado." });
  }

  const senhaHash = await bcrypt.hash(senha, 10);
  const usuario = await usuarioModel.criar({ nome, email, senhaHash });

  const token = gerarToken({ id: usuario.id, nome: usuario.nome });

  return res.status(201).json({ usuario, token });
}

// POST /api/auth/login
// Confere email + senha e devolve um token JWT.
async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Informe email e senha." });
  }

  const usuario = await usuarioModel.buscarPorEmail(email);
  if (!usuario) {
    return res.status(401).json({ error: "Email ou senha invalidos." });
  }

  const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
  if (!senhaConfere) {
    return res.status(401).json({ error: "Email ou senha invalidos." });
  }

  const token = gerarToken({ id: usuario.id, nome: usuario.nome });

  return res.json({
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    token,
  });
}

module.exports = { registrar, login };

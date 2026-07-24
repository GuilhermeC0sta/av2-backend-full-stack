const lancamentoModel = require("../models/lancamentoModel");

const TIPOS_VALIDOS = ["receita", "despesa"];

// Valida os campos de um lancamento e retorna uma mensagem de erro
// (ou null se estiver tudo certo). Reaproveitado no criar e no atualizar.
function validarLancamento({ descricao, valor, categoria, tipo }) {
  if (!descricao || !categoria || !tipo || valor === undefined) {
    return "Informe descricao, valor, categoria e tipo.";
  }

  const valorNumerico = Number(valor);
  if (Number.isNaN(valorNumerico) || valorNumerico <= 0) {
    return "O valor deve ser um numero maior que zero.";
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    return "O tipo deve ser 'receita' ou 'despesa'.";
  }

  return null;
}

// GET /api/lancamentos - lista os lancamentos do usuario autenticado.
async function listar(req, res) {
  const lancamentos = await lancamentoModel.listarPorUsuario(req.usuario.id);
  return res.json(lancamentos);
}

// GET /api/lancamentos/:id - detalha um lancamento do usuario.
async function obter(req, res) {
  const lancamento = await lancamentoModel.buscarPorId(
    req.params.id,
    req.usuario.id
  );

  if (!lancamento) {
    return res.status(404).json({ error: "Lancamento nao encontrado." });
  }

  return res.json(lancamento);
}

// POST /api/lancamentos - cria um lancamento para o usuario autenticado.
async function criar(req, res) {
  const { descricao, valor, categoria, tipo } = req.body;

  const erro = validarLancamento({ descricao, valor, categoria, tipo });
  if (erro) {
    return res.status(400).json({ error: erro });
  }

  const lancamento = await lancamentoModel.criar({
    descricao,
    valor: Number(valor),
    categoria,
    tipo,
    usuarioId: req.usuario.id,
  });

  return res.status(201).json(lancamento);
}

// PUT /api/lancamentos/:id - atualiza um lancamento do usuario.
async function atualizar(req, res) {
  const { descricao, valor, categoria, tipo } = req.body;

  const erro = validarLancamento({ descricao, valor, categoria, tipo });
  if (erro) {
    return res.status(400).json({ error: erro });
  }

  const atualizado = await lancamentoModel.atualizar(
    req.params.id,
    req.usuario.id,
    { descricao, valor: Number(valor), categoria, tipo }
  );

  if (!atualizado) {
    return res.status(404).json({ error: "Lancamento nao encontrado." });
  }

  return res.json(atualizado);
}

// DELETE /api/lancamentos/:id - remove um lancamento do usuario.
async function remover(req, res) {
  const removido = await lancamentoModel.deletar(req.params.id, req.usuario.id);

  if (!removido) {
    return res.status(404).json({ error: "Lancamento nao encontrado." });
  }

  return res.status(204).send();
}

module.exports = { listar, obter, criar, atualizar, remover };

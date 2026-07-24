const { query } = require("../config/db");

// Lista todos os lancamentos de um usuario, do mais recente para o mais antigo.
async function listarPorUsuario(usuarioId) {
  const sql = `
    SELECT id, descricao, valor, categoria, tipo, usuario_id, criado_em
    FROM lancamentos
    WHERE usuario_id = $1
    ORDER BY criado_em DESC, id DESC
  `;
  const { rows } = await query(sql, [usuarioId]);
  return rows;
}

// Busca um lancamento especifico garantindo que ele pertence ao usuario.
async function buscarPorId(id, usuarioId) {
  const sql = `
    SELECT id, descricao, valor, categoria, tipo, usuario_id, criado_em
    FROM lancamentos
    WHERE id = $1 AND usuario_id = $2
  `;
  const { rows } = await query(sql, [id, usuarioId]);
  return rows[0] || null;
}

// Cria um novo lancamento vinculado ao usuario (chave estrangeira).
async function criar({ descricao, valor, categoria, tipo, usuarioId }) {
  const sql = `
    INSERT INTO lancamentos (descricao, valor, categoria, tipo, usuario_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, descricao, valor, categoria, tipo, usuario_id, criado_em
  `;
  const { rows } = await query(sql, [descricao, valor, categoria, tipo, usuarioId]);
  return rows[0];
}

// Atualiza um lancamento existente (somente se pertencer ao usuario).
async function atualizar(id, usuarioId, { descricao, valor, categoria, tipo }) {
  const sql = `
    UPDATE lancamentos
    SET descricao = $1, valor = $2, categoria = $3, tipo = $4
    WHERE id = $5 AND usuario_id = $6
    RETURNING id, descricao, valor, categoria, tipo, usuario_id, criado_em
  `;
  const { rows } = await query(sql, [descricao, valor, categoria, tipo, id, usuarioId]);
  return rows[0] || null;
}

// Remove um lancamento (somente se pertencer ao usuario).
// Retorna o registro removido ou null se nada foi apagado.
async function deletar(id, usuarioId) {
  const sql = `
    DELETE FROM lancamentos
    WHERE id = $1 AND usuario_id = $2
    RETURNING id
  `;
  const { rows } = await query(sql, [id, usuarioId]);
  return rows[0] || null;
}

module.exports = {
  listarPorUsuario,
  buscarPorId,
  criar,
  atualizar,
  deletar,
};

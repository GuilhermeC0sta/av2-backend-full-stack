const { query } = require("../config/db");

// Cria um novo usuario e retorna os dados publicos (sem a senha).
async function criar({ nome, email, senhaHash }) {
  const sql = `
    INSERT INTO usuarios (nome, email, senha_hash)
    VALUES ($1, $2, $3)
    RETURNING id, nome, email, criado_em
  `;
  const { rows } = await query(sql, [nome, email, senhaHash]);
  return rows[0];
}

// Busca por email incluindo o hash da senha (usado no login).
async function buscarPorEmail(email) {
  const sql = `SELECT id, nome, email, senha_hash FROM usuarios WHERE email = $1`;
  const { rows } = await query(sql, [email]);
  return rows[0] || null;
}

// Busca por id retornando apenas dados publicos.
async function buscarPorId(id) {
  const sql = `SELECT id, nome, email, criado_em FROM usuarios WHERE id = $1`;
  const { rows } = await query(sql, [id]);
  return rows[0] || null;
}

module.exports = {
  criar,
  buscarPorEmail,
  buscarPorId,
};

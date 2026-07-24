// Script de seed: cria um usuario de teste para facilitar a avaliacao.
// Uso: node db/seed.js
// Credenciais criadas:  email: teste@teste.com  |  senha: teste123
require("dotenv").config();

const bcrypt = require("bcryptjs");
const { pool } = require("../src/config/db");

const USUARIO_TESTE = {
  nome: "Usuario de Teste",
  email: "teste@teste.com",
  senha: "teste123",
};

async function seed() {
  try {
    const existente = await pool.query(
      "SELECT id FROM usuarios WHERE email = $1",
      [USUARIO_TESTE.email]
    );

    if (existente.rows.length > 0) {
      console.log(`Usuario de teste ja existe (${USUARIO_TESTE.email}).`);
      return;
    }

    const senhaHash = await bcrypt.hash(USUARIO_TESTE.senha, 10);
    const { rows } = await pool.query(
      `INSERT INTO usuarios (nome, email, senha_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nome, email`,
      [USUARIO_TESTE.nome, USUARIO_TESTE.email, senhaHash]
    );

    console.log("Usuario de teste criado com sucesso:", rows[0]);
    console.log(`Login: ${USUARIO_TESTE.email} | Senha: ${USUARIO_TESTE.senha}`);
  } catch (err) {
    console.error("Erro ao criar usuario de teste:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();

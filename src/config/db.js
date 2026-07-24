const { Pool } = require("pg");

// Pool de conexoes com o PostgreSQL.
// A string de conexao vem do .env (DATABASE_URL).
// Em producao (ex: Render) a conexao exige SSL; por isso ativamos
// o SSL quando NODE_ENV === "production".
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("error", (err) => {
  console.error("Erro inesperado no pool de conexoes do PostgreSQL:", err);
});

// Helper para executar queries reaproveitando o mesmo pool.
function query(text, params) {
  return pool.query(text, params);
}

module.exports = { pool, query };

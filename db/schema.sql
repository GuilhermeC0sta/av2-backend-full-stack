-- Schema do banco de dados "Controle de Gastos"
-- Duas tabelas relacionadas por chave estrangeira:
--   usuarios (1) -----< (N) lancamentos

-- Remove as tabelas caso ja existam (util para recriar o banco do zero).
DROP TABLE IF EXISTS lancamentos;
DROP TABLE IF EXISTS usuarios;

-- Tabela de usuarios (autenticacao).
CREATE TABLE usuarios (
  id          SERIAL PRIMARY KEY,
  nome        VARCHAR(120) NOT NULL,
  email       VARCHAR(160) NOT NULL UNIQUE,
  senha_hash  VARCHAR(255) NOT NULL,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Tabela de lancamentos (receitas e despesas).
-- usuario_id e a CHAVE ESTRANGEIRA que liga cada lancamento ao seu dono.
-- ON DELETE CASCADE: ao apagar um usuario, seus lancamentos sao removidos junto.
CREATE TABLE lancamentos (
  id          SERIAL PRIMARY KEY,
  descricao   VARCHAR(160) NOT NULL,
  valor       NUMERIC(12, 2) NOT NULL CHECK (valor > 0),
  categoria   VARCHAR(60) NOT NULL,
  tipo        VARCHAR(10) NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  usuario_id  INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  criado_em   TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indice para acelerar a busca dos lancamentos de um usuario.
CREATE INDEX idx_lancamentos_usuario_id ON lancamentos(usuario_id);

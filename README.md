# Controle de Gastos — API (Backend)

API REST do projeto **Controle de Gastos**, desenvolvida como Projeto Final do curso OxeTech Full Stack. É o backend que dá vida ao frontend da avaliação anterior, transformando-o em uma aplicação full-stack.

Permite que cada usuário cadastre-se, faça login e gerencie suas próprias **receitas e despesas** (lançamentos), com autenticação por token JWT.

- **Frontend do projeto:** [av2-frontend-full-stack](https://github.com/GuilhermeC0sta/av2-frontend-full-stack)

## Tecnologias

- **Node.js** + **Express** — servidor e rotas
- **PostgreSQL** — banco de dados relacional (biblioteca `pg`)
- **JSON Web Token (JWT)** — autenticação (`jsonwebtoken`)
- **bcryptjs** — hash das senhas
- **dotenv** — variáveis de ambiente
- **cors** e **morgan** — CORS e log de requisições

## Arquitetura (MVC)

O código segue a separação de responsabilidades ensinada no curso:

```
av2-backend-full-stack/
├── server.js                     # ponto de entrada (sobe o servidor)
├── db/
│   ├── schema.sql                # criação das tabelas (usuarios e lancamentos)
│   └── seed.js                   # cria o usuário de teste
└── src/
    ├── app.js                    # configuração do Express (CORS, JSON, rotas)
    ├── config/
    │   └── db.js                 # pool de conexões com o PostgreSQL
    ├── models/                   # MODEL — acesso ao banco de dados
    │   ├── usuarioModel.js
    │   └── lancamentoModel.js
    ├── controllers/              # CONTROLLER — regras de negócio
    │   ├── authController.js
    │   └── lancamentoController.js
    ├── routes/                   # ROUTES — definição dos endpoints
    │   ├── authRoutes.js
    │   └── lancamentoRoutes.js
    ├── middlewares/              # MIDDLEWARES
    │   ├── authMiddleware.js     # valida o JWT e protege as rotas
    │   ├── asyncHandler.js       # captura erros de rotas async
    │   ├── notFound.js           # 404 padronizado
    │   └── errorHandler.js       # tratamento central de erros
    └── utils/
        └── token.js              # geração e verificação do JWT
```

## Modelo de dados

Duas tabelas relacionadas por **chave estrangeira** (`lancamentos.usuario_id → usuarios.id`):

| Tabela        | Campos principais                                                             |
|---------------|-------------------------------------------------------------------------------|
| `usuarios`    | `id`, `nome`, `email` (único), `senha_hash`, `criado_em`                      |
| `lancamentos` | `id`, `descricao`, `valor`, `categoria`, `tipo`, `usuario_id` (FK), `criado_em` |

## Endpoints

| Método | Rota                     | Protegida (JWT) | Descrição                          |
|--------|--------------------------|:---------------:|------------------------------------|
| POST   | `/api/auth/registrar`    | Não             | Cadastra um usuário e retorna token |
| POST   | `/api/auth/login`        | Não             | Autentica e retorna token           |
| GET    | `/api/lancamentos`       | Sim             | Lista os lançamentos do usuário     |
| GET    | `/api/lancamentos/:id`   | Sim             | Detalha um lançamento               |
| POST   | `/api/lancamentos`       | Sim             | Cria um lançamento                  |
| PUT    | `/api/lancamentos/:id`   | Sim             | Atualiza um lançamento              |
| DELETE | `/api/lancamentos/:id`   | Sim             | Remove um lançamento                |

As rotas protegidas exigem o header `Authorization: Bearer <token>`. Sem token válido a API responde **401**.

## Variáveis de ambiente

Crie um arquivo `.env` na raiz (use o `.env.example` como base):

| Variável         | Descrição                                                       | Exemplo                                                   |
|------------------|-----------------------------------------------------------------|-----------------------------------------------------------|
| `NODE_ENV`       | `development` (local) ou `production` (deploy, ativa SSL no DB)  | `development`                                             |
| `PORT`           | Porta do servidor                                               | `3000`                                                    |
| `DATABASE_URL`   | String de conexão com o PostgreSQL                              | `postgresql://postgres:postgres@localhost:5432/controle_de_gastos` |
| `JWT_SECRET`     | Segredo para assinar os tokens (use um valor longo e aleatório) | `um-segredo-bem-grande-e-aleatorio`                       |
| `JWT_EXPIRES_IN` | Tempo de expiração do token                                     | `2h`                                                      |
| `CORS_ORIGIN`    | Origem do frontend autorizada no CORS                           | `http://127.0.0.1:5500`                                   |

## Como rodar o projeto do zero (local)

Pré-requisitos: **Node.js 18+** e **PostgreSQL** instalados.

1. Clone o repositório e instale as dependências:
   ```bash
   git clone https://github.com/GuilhermeC0sta/av2-backend-full-stack.git
   cd av2-backend-full-stack
   npm install
   ```

2. Crie o banco de dados no PostgreSQL:
   ```sql
   CREATE DATABASE controle_de_gastos;
   ```

3. Copie o `.env.example` para `.env` e preencha as variáveis (principalmente `DATABASE_URL` e `JWT_SECRET`).

4. Crie as tabelas rodando o schema:
   ```bash
   psql -d controle_de_gastos -f db/schema.sql
   ```

5. (Opcional) Crie o usuário de teste:
   ```bash
   node db/seed.js
   ```

6. Inicie o servidor:
   ```bash
   npm run dev     # com recarga automática (nodemon)
   # ou
   npm start
   ```

A API estará disponível em `http://localhost:3000`.

## Usuário de teste

Para testar rapidamente (login/CRUD) sem precisar cadastrar, use o usuário criado pelo `db/seed.js`:

- **Email:** `teste@teste.com`
- **Senha:** `teste123`

O cadastro de novos usuários também está totalmente funcional pela tela de cadastro do frontend ou pela rota `POST /api/auth/registrar`.

## Deploy

- Backend publicado no **Render**.
- Em produção, defina as variáveis de ambiente no painel do Render (incluindo `NODE_ENV=production` e o `CORS_ORIGIN` com a URL do frontend na Vercel).

## Autor

Guilherme Costa — Projeto Final do curso OxeTech Full Stack.

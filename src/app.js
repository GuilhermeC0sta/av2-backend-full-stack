const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const lancamentoRoutes = require("./routes/lancamentoRoutes");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Libera apenas a origem do frontend definida no .env (CORS_ORIGIN).
// Se nao houver a variavel, libera qualquer origem (util so em desenvolvimento).
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

// Rota de health check - util para verificar se a API esta no ar (deploy).
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "API Controle de Gastos rodando",
  });
});

// Rotas de autenticacao (cadastro e login) - publicas.
app.use("/api/auth", authRoutes);

// Rotas do recurso principal (lancamentos) - protegidas por JWT.
app.use("/api/lancamentos", lancamentoRoutes);

// Middlewares de tratamento de erro devem ficar por ultimo.
app.use(notFound);
app.use(errorHandler);

module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rotas
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API da Loja Online' });
});

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;

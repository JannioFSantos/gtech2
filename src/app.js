require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Criar pasta uploads se não existir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API da Loja Online' });
});

// Rotas da API
app.use(userRoutes); // Já inclui o prefixo /v1/user nas rotas
app.use('/v1/category', require('./routes/categoryRoutes'));
app.use('/v1/product', require('./routes/productRoutes'));

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;

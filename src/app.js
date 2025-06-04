require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Criar pasta uploads se não existir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração CORS
const corsOptions = {
  origin: '*', // Permitir qualquer origem temporariamente
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middlewares - Ordem CRÍTICA
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(`[1] Recebida requisição: ${req.method} ${req.originalUrl}`);
  next();
});
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API da Loja Online' });
});

// Removido redirecionamento automático

// Rotas da API
console.log('Registrando rotas...');

// Rotas de usuário com prefixo /api
const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes); // Prefixo API

// Debug das rotas registradas
console.log('Rotas de usuário registradas:');
const printRoutes = (router, prefix = '') => {
  router.stack.forEach(layer => {
    if (layer.route) {
      console.log(`${layer.route.stack[0].method.toUpperCase()} ${prefix}${layer.route.path}`);
    } else if (layer.name === 'router') {
      printRoutes(layer.handle, prefix + layer.regexp.source.replace('\\/?(?=\\/|$)', ''));
    }
  });
};
printRoutes(userRoutes, '/v1/users');

// Outras rotas
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

// Registrar todas as rotas
const routes = [
  { path: '/v1/categories', router: categoryRoutes },
  { path: '/v1/products', router: productRoutes }
];

routes.forEach(route => {
  app.use(route.path, (req, res, next) => {
    console.log(`Rota base ${route.path} acessada`);
    next();
  }, route.router);
});

// Rota de teste
app.post('/v1/users/test', (req, res) => {
  console.log('Rota de teste alcançada');
  res.status(200).json({message: 'Rota funcionando'});
});

// Removido logs de rotas carregadas que causavam erros de referência

// Log de rotas registradas (versão simplificada)
console.log('Rotas registradas:');
app._router.stack.forEach(layer => {
  if (layer.route) {
    console.log(layer.route.path);
  } else if (layer.name === 'router') {
    console.log(`Router: ${layer.regexp.source}`);
  }
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

module.exports = app;

require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');
const path = require('path');
const fs = require('fs');

// Garantir que a pasta uploads existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Sincronizar modelos com o banco de dados
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
    
// Iniciar servidor
    const PORT = 3002;
    const server = app.listen(PORT, 'localhost', () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log('Configuração de rotas:');
      console.log(app._router.stack.filter(layer => layer.name === 'router').map(layer => ({
        path: layer.regexp.source.replace('\\/?(?=\\/|$)', ''),
        methods: layer.handle.stack.map(route => route.route.stack[0].method)
      })));
      console.log('Rotas registradas:');
      app._router.stack.forEach(layer => {
        if (layer.route) {
          console.log(`${layer.route.stack[0].method.toUpperCase()} ${layer.route.path}`);
        } else if (layer.name === 'router') {
          layer.handle.stack.forEach(route => {
            console.log(`${route.route.stack[0].method.toUpperCase()} /v1${layer.regexp.source.replace('\\/?(?=\\/|$)', '')}${route.route.path}`);
          });
        }
      });
    });
    
    module.exports = server;
  })
  .catch(err => {
    console.error('Erro ao sincronizar modelos:', err);
    process.exit(1);
  });

module.exports = sequelize;

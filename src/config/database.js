const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

// Configuração para SQLite
const storagePath = path.join(__dirname, '../database.sqlite');

// Garante que o diretório existe
const dir = path.dirname(storagePath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Cria tabelas se não existirem
sequelize.sync();

module.exports = sequelize;

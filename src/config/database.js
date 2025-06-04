const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configurações do banco de dados
const dbConfig = {
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || './database.sqlite',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  retry: {
    max: 3,
    timeout: 10000
  }
};

// Configurações adicionais para produção
if (process.env.NODE_ENV === 'production') {
  dbConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

const sequelize = new Sequelize(dbConfig);

// Função para testar conexão com retry
const testConnection = async () => {
  let retries = 3;
  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log('Conexão com o banco de dados estabelecida com sucesso.');
      return true;
    } catch (err) {
      retries--;
      console.error(`Falha na conexão com o banco de dados. Tentativas restantes: ${retries}`, err);
      if (retries === 0) {
        throw err;
      }
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

// Testar conexão (sem sincronizar modelos aqui)
testConnection()
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados após várias tentativas:', err);
    process.exit(1);
  });

module.exports = sequelize;

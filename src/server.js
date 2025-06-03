require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

// Sincronizar modelos com o banco de dados
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Modelos sincronizados com o banco de dados.');
    
    // Iniciar servidor
    const PORT = 3001; // Usando porta fixa para teste
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT} (modo teste)`);
    });
  })
  .catch(err => {
    console.error('Erro ao sincronizar modelos:', err);
    process.exit(1);
  });

module.exports = sequelize;

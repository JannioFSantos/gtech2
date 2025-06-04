const redis = require('redis');
const logger = require('../config/logger');

// Configurar cliente Redis (pode ser substituído por outro mecanismo de cache)
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

redisClient.on('error', (err) => {
  logger.error('Redis error:', err);
});

module.exports = {
  /**
   * Obtém dados do cache
   * @param {string} key - Chave do cache
   * @returns {Promise<any>} - Dados em cache ou null
   */
  getFromCache: (key) => {
    return new Promise((resolve) => {
      redisClient.get(key, (err, result) => {
        if (err) {
          logger.error('Erro ao buscar no cache', { error: err.message });
          return resolve(null);
        }
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          resolve(null);
        }
      });
    });
  },

  /**
   * Armazena dados no cache
   * @param {string} key - Chave do cache 
   * @param {any} value - Valor a ser armazenado
   * @param {number} ttl - Tempo de vida em segundos
   * @returns {Promise<boolean>} - True se armazenado com sucesso
   */
  setCache: (key, value, ttl) => {
    return new Promise((resolve) => {
      redisClient.setex(key, ttl, JSON.stringify(value), (err) => {
        if (err) {
          logger.error('Erro ao armazenar no cache', { error: err.message });
          return resolve(false);
        }
        resolve(true);
      });
    });
  },

  /**
   * Valida os dados de criação de produto
   * @param {object} productData - Dados do produto
   * @returns {Array} - Lista de erros de validação
   */
  validateProductData: (productData) => {
    const errors = [];
    
    if (!productData.name || productData.name.length < 3) {
      errors.push('Nome do produto deve ter pelo menos 3 caracteres');
    }
    
    if (!productData.price || isNaN(productData.price)) {
      errors.push('Preço deve ser um número válido');
    }
    
    // Adicione mais validações conforme necessário
    
    return errors;
  }
};

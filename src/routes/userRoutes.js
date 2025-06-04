const express = require('express');
const router = express.Router({ mergeParams: true }); // Habilita merge de parâmetros
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware de log
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Rotas públicas
router.post('/token', userController.generateToken);
router.post('/register', userController.createUser);

// Rotas protegidas
router.use(authMiddleware); // Aplica middleware para todas as rotas abaixo
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

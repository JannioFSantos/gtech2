const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rotas para usuários
router.post('/v1/user/token', userController.generateToken); // Requisito 01 - Seção 05
router.get('/v1/user/:id', userController.getUserById); // Requisito 01 - Seção 02
router.post('/v1/user', userController.createUser); // Requisito 02 - Seção 02
router.put('/v1/user/:id', userController.updateUser); // Requisito 04 - Seção 02
router.delete('/v1/user/:id', userController.deleteUser); // Requisito 05 - Seção 02

module.exports = router;

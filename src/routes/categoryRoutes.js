const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas para categorias (Seção 03)
router.get('/v1/category/search', categoryController.searchCategories); // Requisito 01
router.get('/v1/category/:id', categoryController.getCategoryById); // Requisito 02
router.post('/v1/category', authMiddleware, categoryController.createCategory); // Requisito 03
router.put('/v1/category/:id', authMiddleware, categoryController.updateCategory); // Requisito 04
router.delete('/v1/category/:id', authMiddleware, categoryController.deleteCategory); // Requisito 05

module.exports = router;

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas para categorias (Seção 03)
router.get('/search', categoryController.searchCategories); // Requisito 01
router.get('/:id', categoryController.getCategoryById); // Requisito 02
router.post('/', authMiddleware, categoryController.createCategory); // Requisito 03
router.put('/:id', authMiddleware, categoryController.updateCategory); // Requisito 04
router.delete('/:id', authMiddleware, categoryController.deleteCategory); // Requisito 05

module.exports = router;

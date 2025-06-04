const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas para produtos (Seção 04)
router.get('/search', productController.searchProducts); // Requisito 01
router.get('/:id', productController.getProductById); // Requisito 02
router.post('/', authMiddleware, productController.createProduct); // Requisito 03
router.put('/:id', authMiddleware, productController.updateProduct); // Requisito 04
router.delete('/:id', authMiddleware, productController.deleteProduct); // Requisito 05

module.exports = router;

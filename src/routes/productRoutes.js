const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas para produtos (Seção 04)
router.get('/v1/product/search', productController.searchProducts); // Requisito 01
router.get('/v1/product/:id', productController.getProductById); // Requisito 02
router.post('/v1/product', authMiddleware, productController.createProduct); // Requisito 03
router.put('/v1/product/:id', authMiddleware, productController.updateProduct); // Requisito 04
router.delete('/v1/product/:id', authMiddleware, productController.deleteProduct); // Requisito 05

module.exports = router;

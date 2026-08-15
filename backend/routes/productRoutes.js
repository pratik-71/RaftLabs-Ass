const express = require('express');
const router = express.Router();
const { getProducts, getProductBySlug, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middlewares/authMiddleware');

// /api/products
router.route('/')
  .get(getProducts)
  .post(protect, addProduct);

// /api/products/slug/:slug
router.route('/slug/:slug')
  .get(getProductBySlug);

// /api/products/:id
router.route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;

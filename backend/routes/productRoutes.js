const express = require('express');
const router = express.Router();
const { getProducts, getProductBySlug, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// /api/products
router.route('/')
  .get(getProducts)
  .post(addProduct);

// /api/products/slug/:slug
router.route('/slug/:slug')
  .get(getProductBySlug);

// /api/products/:id
router.route('/:id')
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;

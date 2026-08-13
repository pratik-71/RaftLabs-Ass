const express = require('express');
const router = express.Router();
const { getProducts, addProduct, updateProduct, deleteProduct } = require('../controllers/productController');

// /api/products
router.route('/')
  .get(getProducts)
  .post(addProduct);

// /api/products/:id
router.route('/:id')
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;

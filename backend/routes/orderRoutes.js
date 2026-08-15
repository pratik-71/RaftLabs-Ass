const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

// @route   POST /api/orders
router.post('/', createOrder);

// @route   GET /api/orders
router.get('/', getOrders);

// @route   GET /api/orders/:id
router.get('/:id', getOrderById);

// @route   PUT /api/orders/:id/status
router.put('/:id/status', protect, updateOrderStatus);

module.exports = router;

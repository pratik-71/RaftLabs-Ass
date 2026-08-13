const { orderSchema, validateData } = require('../utils/validators');

// In-memory database for orders
let orders = [];

// @desc    Create a new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    
    // Validate request data
    const validation = validateData(orderSchema, orderData);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const cleanOrder = validation.data;
    
    // Generate a unique tracking number
    const trackingNumber = 'TRK-' + Math.random().toString(36).substring(2, 10).toUpperCase();

    const order = {
      id: orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1,
      tracking_number: trackingNumber,
      ...cleanOrder,
      status: 'Order Received', // Initial status
      createdAt: new Date().toISOString()
    };

    orders.push(order);
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all orders (could filter by user if authenticated)
// @route   GET /api/orders
// @access  Public
exports.getOrders = async (req, res) => {
  try {
    // Sort so newest are first
    const sortedOrders = [...orders].reverse();
    res.status(200).json({ success: true, data: sortedOrders });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const order = orders.find(o => o.id === id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    orders[index] = { ...orders[index], status };
    res.status(200).json({ success: true, data: orders[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

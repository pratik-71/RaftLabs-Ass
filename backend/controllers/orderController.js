const { orderSchema, validateData } = require('../utils/validators');
const supabase = require('../config/db');

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
      tracking_number: trackingNumber,
      ...cleanOrder,
      status: 'Order Received'
    };

    const { data, error } = await supabase.from('orders').insert([order]).select().single();
    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all orders (could filter by user if authenticated)
// @route   GET /api/orders
// @access  Public
exports.getOrders = async (req, res) => {
  try {
    // Sort so newest are first
    const { data, error } = await supabase.from('orders').select('*').order('id', { ascending: false });
    if (error) throw error;
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { data, error } = await supabase.from('orders').select('*').eq('id', id).single();
    
    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
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
    
    const { data, error } = await supabase.from('orders').update({ status }).eq('id', id).select().single();
    
    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

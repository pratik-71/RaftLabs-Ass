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
    
    const order = {
      user_id: cleanOrder.userId,
      total_amount: cleanOrder.totalAmount,
      delivery_name: cleanOrder.deliveryDetails.name,
      delivery_address: cleanOrder.deliveryDetails.address,
      delivery_phone: cleanOrder.deliveryDetails.phone,
      status: 'Order Received'
      // Note: tracking_number, delivery_fee are not in the schema
    };

    const { data: orderDataRes, error: orderError } = await supabase.from('orders').insert([order]).select().single();
    if (orderError) throw orderError;

    // Insert order items
    if (cleanOrder.items && cleanOrder.items.length > 0) {
      const orderItems = cleanOrder.items.map(item => ({
        order_id: orderDataRes.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;
    }

    res.status(201).json({ success: true, data: orderDataRes });
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
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(name, image_url, slug))')
      .order('id', { ascending: false });
      
    if (error) throw error;
    
    const formattedData = data.map(order => ({
      ...order,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
      deliveryDetails: {
        name: order.delivery_name,
        address: order.delivery_address,
        phone: order.delivery_phone
      },
      items: order.order_items ? order.order_items.map(item => ({
        quantity: item.quantity,
        price: item.price,
        name: item.product ? item.product.name : 'Unknown Product',
        imageUrl: item.product ? item.product.image_url : null,
        slug: item.product ? item.product.slug : null
      })) : []
    }));
    
    res.status(200).json({ success: true, data: formattedData });
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
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(name, image_url, slug))')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    const formattedData = {
      ...data,
      totalAmount: data.total_amount,
      createdAt: data.created_at,
      deliveryDetails: {
        name: data.delivery_name,
        address: data.delivery_address,
        phone: data.delivery_phone
      },
      items: data.order_items ? data.order_items.map(item => ({
        quantity: item.quantity,
        price: item.price,
        name: item.product ? item.product.name : 'Unknown Product',
        imageUrl: item.product ? item.product.image_url : null,
        slug: item.product ? item.product.slug : null
      })) : []
    };
    
    res.status(200).json({ success: true, data: formattedData });
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

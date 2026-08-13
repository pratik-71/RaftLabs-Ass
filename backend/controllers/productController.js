// In-memory mock database for products
let products = [
  { id: 1, name: 'Classic Burger', description: 'Beef patty with lettuce and tomato', price: 8.99, category: 'Main Course', items: ['patty', 'lettuce', 'tomato'], imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Cheese Fries', description: 'Crispy fries with melted cheddar', price: 4.99, category: 'Appetizers', items: ['fries', 'cheese'], imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Vanilla Shake', description: 'Creamy vanilla milkshake', price: 3.99, category: 'Drinks', items: ['milk', 'vanilla ice cream'], imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75bf699?q=80&w=600&auto=format&fit=crop' }
];

// @desc    Get all products (with optional search query)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { q } = req.query;
    let results = products;

    if (q) {
      const search = q.toLowerCase();
      results = products.filter(p => 
        p.name.toLowerCase().includes(search) || 
        p.description.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
      );
    }
    
    // Sort so newest are first
    const sortedResults = [...results].reverse();
    
    res.status(200).json({ success: true, data: sortedResults });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Add a product
// @route   POST /api/products
// @access  Private/Admin
exports.addProduct = async (req, res) => {
  try {
    const product = req.body;
    product.id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push(product);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;
    
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // update items array if it comes as string from frontend
    if (typeof updateData.items === 'string') {
       updateData.items = updateData.items.split(',').map(i => i.trim());
    }

    products[index] = { ...products[index], ...updateData };
    res.status(200).json({ success: true, data: products[index] });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    products = products.filter(p => p.id !== id);
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

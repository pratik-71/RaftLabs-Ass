const { productSchema, validateData } = require('../utils/validators');

// In-memory database for products
let products = [];

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

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = products.find(p => p.slug === slug);
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    res.status(200).json({ success: true, data: product });
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
    
    // Validate request data
    const validation = validateData(productSchema, product);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error });
    }
    
    // Use validated data to ensure clean types
    const cleanProduct = validation.data;
    cleanProduct.id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // Auto-generate slug if not provided
    if (!cleanProduct.slug) {
      cleanProduct.slug = cleanProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    
    products.push(cleanProduct);
    res.status(201).json({ success: true, data: cleanProduct });
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

    // Merge existing with updates before validating
    const mergedData = { ...products[index], ...updateData };
    
    // Validate merged data
    const validation = validateData(productSchema, mergedData);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const cleanProduct = validation.data;
    if (updateData.name && !updateData.slug) {
      cleanProduct.slug = cleanProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    products[index] = cleanProduct;
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

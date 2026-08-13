const { productSchema, validateData } = require('../utils/validators');
const supabase = require('../config/db');

// @desc    Get all products (with optional search query)
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { q } = req.query;
    let query = supabase.from('products').select('*');
    
    if (q) {
      const search = q.toLowerCase();
      // Searching name, description, category. Supabase ilike is case-insensitive.
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
    }
    
    // Sort so newest are first by id descending (assuming id is primary key)
    query = query.order('id', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    
    // Map image_url back to imageUrl for the frontend
    const mappedData = data.map(item => {
      const mappedItem = { ...item };
      mappedItem.imageUrl = item.image_url;
      delete mappedItem.image_url;
      return mappedItem;
    });
    
    res.status(200).json({ success: true, data: mappedData });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
exports.getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
    
    if (error || !data) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const mappedData = { ...data };
    mappedData.imageUrl = data.image_url;
    delete mappedData.image_url;
    
    res.status(200).json({ success: true, data: mappedData });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
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
    
    const cleanProduct = validation.data;
    
    // Auto-generate slug if not provided
    if (!cleanProduct.slug) {
      cleanProduct.slug = cleanProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (cleanProduct.imageUrl !== undefined) {
      cleanProduct.image_url = cleanProduct.imageUrl;
      delete cleanProduct.imageUrl;
    }
    
    const { data, error } = await supabase.from('products').insert([cleanProduct]).select().single();
    
    if (error) throw error;
    
    res.status(201).json({ success: true, data });
  } catch (error) {
    console.error('Error adding product:', error);
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
    
    // Fetch existing
    const { data: existing, error: fetchError } = await supabase.from('products').select('*').eq('id', id).single();
    if (fetchError || !existing) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // update items array if it comes as string from frontend
    if (typeof updateData.items === 'string') {
       updateData.items = updateData.items.split(',').map(i => i.trim());
    }

    // Merge existing with updates before validating
    const mergedData = { ...existing, ...updateData };
    
    // Clean id and timestamps out for validation if schema doesn't expect it
    const dataToValidate = { ...mergedData };
    delete dataToValidate.id;
    delete dataToValidate.created_at;
    
    // Validate merged data
    const validation = validateData(productSchema, dataToValidate);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: validation.error });
    }

    const cleanProduct = validation.data;
    if (updateData.name && !updateData.slug) {
      cleanProduct.slug = cleanProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    if (cleanProduct.imageUrl !== undefined) {
      cleanProduct.image_url = cleanProduct.imageUrl;
      delete cleanProduct.imageUrl;
    }

    const { data, error } = await supabase.from('products').update(cleanProduct).eq('id', id).select().single();
    
    if (error) throw error;
    
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

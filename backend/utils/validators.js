const { z } = require('zod');

// Product Validation Schema
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long"),
  slug: z.string().min(3, "Slug is required").optional(),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  items: z.array(z.string()).min(1, "At least one item is required"),
  imageUrl: z.string().optional()
});

// Checkout Delivery Validation Schema
const deliverySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

// Order Item Validation Schema
const orderItemSchema = z.object({
  product_id: z.number().or(z.string()),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
  name: z.string().optional(),
  imageUrl: z.string().optional()
});

// Order Validation Schema
const orderSchema = z.object({
  items: z.array(orderItemSchema).min(1, "Order must contain at least one item"),
  totalAmount: z.number().min(0.01, "Total amount must be greater than 0"),
  deliveryFee: z.number().min(0, "Delivery fee cannot be negative"),
  deliveryDetails: deliverySchema,
  userId: z.string().uuid("Invalid user ID")
});

// Helper function to validate data like a python serializer
function validateData(schema, data) {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    // Format the first error message beautifully
    const firstError = result.error.errors[0];
    return { success: false, error: firstError.message };
  }
}

module.exports = {
  productSchema,
  orderSchema,
  validateData
};

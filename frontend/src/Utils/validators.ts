import { z } from 'zod';

// Product Validation Schema
export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long"),
  slug: z.string().min(3, "Slug is required").optional(),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  items: z.string().min(1, "At least one item is required"),
  stock: z.number().int().min(0, "Stock cannot be negative").default(0),
});

// Checkout Delivery Validation Schema
export const deliverySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
});

// Helper function to validate data like a python serializer
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    // Format the first error message beautifully
    const firstError = result.error.issues[0];
    return { success: false, error: firstError.message };
  }
}

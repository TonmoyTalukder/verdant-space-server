import { z } from 'zod';

export const saleSchema = z.object({
  onSale: z.string(),
  onSaleDiscountPercentage: z
    .number()
    .min(0)
    .max(100, 'Discount percentage must be between 0 and 100'),
});

export const inventorySchema = z.object({
  quantity: z.number().min(0, 'Quantity must be a positive number'),
  inStock: z.boolean(),
});

export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be a positive number'),
  image: z.string().url('Image must be a valid URL'),
  type: z.string().min(1, 'Type is required'),
  seasonal: z.string().optional(),
  rating: z.number().min(0).max(5, 'Rating must be between 0 and 5'),
  sale: saleSchema,
  tags: z.array(z.string()).optional(),
  inventory: inventorySchema,
  isDeleted: z.boolean().optional(), // Add soft delete validation
  insertDate: z.string().optional(),
});

export const updateProductSchema = z.object({
  productId: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  price: z.number().optional(),
  image: z.string().url().optional(),
  type: z.string().optional(),
  seasonal: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  sale: saleSchema.optional(),
  tags: z.array(z.string()).optional(),
  inventory: inventorySchema.optional(),
  isDeleted: z.boolean().optional(), // Add soft delete validation
  insertDate: z.string().optional(),
});

import { z } from 'zod';

const orderProductSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

// Payment Schema Validation
const paymentSchema = z.object({
  method: z.string().min(1, 'Payment method is required'),
  status: z.string().min(1, 'Payment status is required'),
  price: z.number().min(0, 'Price must be a positive number'),
});

// Order Details Schema Validation
const orderDetailsSchema = z.object({
  status: z.string().min(1, 'Order status is required'),
  delivery: z.boolean().optional(),
});

// Create Order Validation Schema
export const createOrderSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  products: z.array(orderProductSchema).min(1, 'At least one product is required'),
  address: z.string().min(1, 'Address is required'),
  payment: paymentSchema,
  order: orderDetailsSchema,
});

// Update Order Validation Schema
export const updateOrderSchema = z.object({
  userId: z.string().optional(),
  products: z.array(orderProductSchema).optional(),
  address: z.string().optional(),
  payment: paymentSchema.optional(),
  order: orderDetailsSchema.optional(),
});

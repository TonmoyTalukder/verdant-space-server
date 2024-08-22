import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  contactNo: z.string().min(10, 'Contact number must be at least 10 digits'),
  address: z.string().min(1, 'Address is required'),
  isAdmin: z.boolean().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .optional(),
  contactNo: z
    .string()
    .min(10, 'Contact number must be at least 10 digits')
    .optional(),
  address: z.string().optional(),
  isAdmin: z.boolean().optional(),
});

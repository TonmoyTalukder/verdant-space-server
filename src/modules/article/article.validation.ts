// article.validation.ts
import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authorName: z.string().min(1, 'Author name is required'),
  authorDescription: z.string().min(1, 'Author description is required'),
  productsType: z.string().min(1, 'Products type is required'),
  content: z.array(
    z.object({
      type: z.enum(['text', 'image']),
      value: z.string().min(1, 'Content value is required'),
      imageDescription: z.string().optional(),
    })
  ).min(1, 'At least one content field is required'),
});

export const updateArticleSchema = z.object({
  title: z.string().optional(),
  authorName: z.string().optional(),
  authorDescription: z.string().optional(),
  productsType: z.string().optional(),
  content: z.array(
    z.object({
      type: z.enum(['text', 'image']).optional(),
      value: z.string().optional(),
      imageDescription: z.string().optional(),
    })
  ).optional(),
});

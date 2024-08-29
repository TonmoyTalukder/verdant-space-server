// article.model.ts
import { Schema, model } from 'mongoose';
import { TArticle } from './article.interface';

const articleSchema = new Schema<TArticle>(
  {
    title: { type: String, required: true },
    authorName: { type: String, required: true },
    authorDescription: { type: String, required: true },
    productsType: { type: String, required: true },
    content: [
      {
        type: { type: String, required: true, enum: ['text', 'image'] },
        value: { type: String, required: true }, // Text content or image path
        header: { type: String, default: '' },
        imageDescription: { type: String, default: '' },
      },
    ],
    tags: { type: [String], required: true },
    isDeleted: { type: Boolean, default: false }, // Soft delete field
  },
  {
    timestamps: true,
  },
);

export const Article = model<TArticle>('Article', articleSchema);

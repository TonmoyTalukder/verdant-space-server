import { Schema, model } from 'mongoose';
import { TInventory, TProduct, TSale } from './product.interface';

const saleSchema = new Schema<TSale>({
  onSale: { type: String, required: true },
  onSaleDiscountPercentage: { type: Number, required: true },
});

const inventorySchema = new Schema<TInventory>({
  quantity: { type: Number, required: true },
  inStock: { type: Boolean, required: true },
});

const productSchema = new Schema<TProduct>(
  {
    productId: { type: String, required: true, unique: true }, // Ensure uniqueness of productId
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
    seasonal: { type: String, required: true },
    rating: { type: Number, required: true },
    sale: { type: saleSchema, required: true },
    tags: { type: [String], required: true },
    inventory: { type: inventorySchema, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export const Product = model<TProduct>('Product', productSchema);

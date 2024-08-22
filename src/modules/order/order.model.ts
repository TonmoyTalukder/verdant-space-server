import { Schema, model } from 'mongoose';
import { TOrder, TOrderDetails, TPayment } from './order.interface';
import { TUser } from '../user/user.interface';

const paymentSchema = new Schema<TPayment>({
  method: { type: String, required: true },
  status: { type: String, required: true },
  price: { type: Number, required: true },
});

const orderDetailsSchema = new Schema<TOrderDetails>({
  status: { type: String, required: true },
  delivery: { type: Boolean, required: true },
  adminApproval: { type: Boolean, default: false },
  checkoutStatus: { type: Boolean, default: false },
});

const userDetailsSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contactNo: { type: String, required: true },
    address: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    isDeleted: { type: Boolean, required: true },
  },
  { _id: false },
);

const orderSchema = new Schema<TOrder>(
  {
    userId: { type: String, required: true },
    userDetails: { type: userDetailsSchema, required: true },
    productId: { type: String, required: true },
    address: { type: String, required: true },
    payment: { type: paymentSchema, required: true },
    order: { type: orderDetailsSchema, required: true },
    quantity: { type: Number, required: true },
    isDeleted: { type: Boolean, default: false }, // Soft delete flag
  },
  {
    timestamps: true,
  },
);

export const Order = model<TOrder>('Order', orderSchema);

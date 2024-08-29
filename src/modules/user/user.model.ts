import { Schema, model } from 'mongoose';
import { TUser } from './user.interface';

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNo: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
    isDeleted: { type: Boolean, default: false }, // Soft delete field
  },
  {
    timestamps: true,
  },
);

export const User = model<TUser>('User', userSchema); // Corrected the export name to "User"

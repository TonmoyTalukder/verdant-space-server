import { TUser } from './user.interface';
import { User } from './user.model';

const createUser = async (payload: TUser) => {
  const result = await User.create(payload);
  return result;
};

const getAllUsers = async () => {
  const result = await User.find({ isDeleted: false });  // Only get non-deleted users
  return result;
};

const getUserById = async (id: string) => {
  const result = await User.findOne({ _id: id, isDeleted: false });  // Exclude deleted users
  if (!result) {
    throw new Error('User not found');
  }
  return result;
};

const updateUser = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findOneAndUpdate(
    { _id: id, isDeleted: false },  // Only update if not deleted
    payload,
    { new: true }
  );
  if (!result) {
    throw new Error('User not found');
  }
  return result;
};

const deleteUser = async (id: string) => {
  const result = await User.findOneAndUpdate(
    { _id: id },  // Find by ID regardless of deletion status
    { isDeleted: true },  // Mark the user as deleted
    { new: true }
  );
  if (!result) {
    throw new Error('User not found');
  }
  return result;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};

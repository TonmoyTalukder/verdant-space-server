import { TUser } from './user.interface';
import { User } from './user.model';

const createUser = async (payload: TUser) => {
  // Check if an email already exists regardless of deletion status
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    // If email exists (even for deleted users), throw an error
    throw new Error('Email already in use');
  }

  const result = await User.create(payload);
  return result;
};


const getAllUsers = async () => {
  const result = await User.find({ isDeleted: false }); // Only get non-deleted users
  return result;
};

const getUserById = async (id: string) => {
  const result = await User.findOne({ _id: id, isDeleted: false }); // Exclude deleted users
  if (!result) {
    throw new Error('User not found');
  }
  return result;
};

const getUserByEmail = async (email: string) => {
  const result = await User.findOne({ email: email, isDeleted: false }); // Exclude deleted users
  if (!result) {
    throw new Error('User not found');
  }
  return result;
};

const updateUser = async (id: string, payload: Partial<TUser>) => {
  const result = await User.findOneAndUpdate(
    { _id: id, isDeleted: false }, // Only update if not deleted
    payload,
    { new: true },
  );
  if (!result) {
    throw new Error('User not found');
  }
  return result;
};

const deleteUser = async (id: string) => {
  const result = await User.findOneAndUpdate(
    { _id: id }, // Find by ID regardless of deletion status
    { isDeleted: true }, // Mark the user as deleted
    { new: true },
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
  getUserByEmail,
  updateUser,
  deleteUser,
};

import { Request, Response } from 'express';
import { UserServices } from './user.service';

const createUser = async (req: Request, res: Response) => {
  const userData = req.body;
  try {
    const result = await UserServices.createUser(userData);
    res.status(201).json({
      success: true,
      message: 'User created successfully!',
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(400).json({
        success: false,
        message: err.message,  // Will now return "Email already in use" if duplicate
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not create user!',
      });
    }
  }
};


const getAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await UserServices.getAllUsers();
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully!',
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not fetch users!',
      });
    }
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const result = await UserServices.getUserById(userID);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'User by ID fetched successfully!',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not fetch user!',
      });
    }
  }
};

const getUserByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const result = await UserServices.getUserByEmail(email);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'User by Email fetched successfully!',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not fetch user!',
      });
    }
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const userData = req.body;
    const result = await UserServices.updateUser(userID, userData);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'User updated successfully!',
        data: result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not update user!',
      });
    }
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;
    const result = await UserServices.deleteUser(userID);

    if (result) {
      res.status(200).json({
        success: true,
        message: 'User deleted successfully (soft deleted)!',
        data: null,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found!',
      });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Could not delete user!',
      });
    }
  }
};

export const UserControllers = {
  createUser,
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};

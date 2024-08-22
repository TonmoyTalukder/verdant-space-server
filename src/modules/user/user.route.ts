import express from 'express';
import { UserControllers } from './user.controller';
import { createUserSchema, updateUserSchema } from './user.validation';
import validate from '../../middleware/middleware.validation';

const router = express.Router();

// Routes
router.post('/', validate(createUserSchema), UserControllers.createUser);
router.get('/:userID', UserControllers.getUserById);
router.get('/', UserControllers.getAllUsers);
router.put('/:userID', validate(updateUserSchema), UserControllers.updateUser);
router.delete('/:userID', UserControllers.deleteUser);

export const UserRoutes = router;

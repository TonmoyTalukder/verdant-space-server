import express from 'express';
import { OrderControllers } from './order.controller';
import { createOrderSchema, updateOrderSchema } from './order.validation';
import validate from '../../middleware/middleware.validation';

const router = express.Router();

router.post('/', validate(createOrderSchema), OrderControllers.createOrder);
router.get('/', OrderControllers.getAllOrders);
router.get('/:id', OrderControllers.getOrderById); 
router.put('/:id', validate(updateOrderSchema), OrderControllers.updateOrder);  // Update order route
router.delete('/:id', OrderControllers.softDeleteOrder);  // Soft delete order route

export const OrderRoutes = router;
